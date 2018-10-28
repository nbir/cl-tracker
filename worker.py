import json
import logging
import pika
import redis
from bs4 import BeautifulSoup
from datetime import datetime
from urllib import request

REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0

AMQP_URL = 'amqp://guest:guest@localhost:5672'


def setup_queue():
    """Setup RabbitMQ exchange, worker and wait queues, and bindings
    """

    logging.info('Setting up exchange, queues and bindings')

    connection = pika.BlockingConnection(pika.URLParameters(AMQP_URL))
    channel = connection.channel()

    channel.exchange_declare(
        exchange='cl-tracker', exchange_type='direct', durable=True)
    channel.queue_declare(queue='cl-tracker.worker', durable=True)
    channel.queue_bind(
        queue='cl-tracker.worker', exchange='cl-tracker', routing_key='worker')
    channel.queue_declare(
        queue='cl-tracker.wait',
        durable=True,
        arguments={
            'x-dead-letter-exchange': 'cl-tracker',
            'x-dead-letter-routing-key': 'worker',
            'x-message-ttl': 60000
        })
    channel.queue_bind(
        queue='cl-tracker.wait', exchange='cl-tracker', routing_key='wait')

    connection.close()


def setup_worker():
    """Consumes messages from the worker queue
    """

    logging.info('Consuming messages from queue...')

    connection = pika.BlockingConnection(pika.URLParameters(AMQP_URL))
    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(process_message, queue='cl-tracker.worker')

    channel.start_consuming()


def process_message(channel, method, properties, body):
    """Processes a message:
        - get page, parse & extract, and update corresponding DB entry
        - if page has expired, update and exit
        - queue next message
    """

    payload = json.loads(body)
    item_id = payload['itemId']
    url = payload['url']

    logging.info('Processing message for item_id {}'.format(item_id))

    post = get_post(url)
    if post is None:
        channel.basic_ack(delivery_tag=method.delivery_tag)
        return  # TODO: mark as invalid/error

    # TODO: check if expired

    fields = get_item_fields(post)

    update_item(item_id, fields)

    queue_next(item_id, url)

    channel.basic_ack(delivery_tag=method.delivery_tag)


def get_post(url):
    """Fetch a HTML document using given URL and parse into a BeautifulSoup object
    """

    logging.info('Fetch url {}'.format(url))

    with request.urlopen(url) as r:
        html_doc = r.read()
        return BeautifulSoup(html_doc, 'html.parser')

    return None


def get_item_fields(post):
    """Extract title and price for an item
    """

    title = post.find('span', id='titletextonly').string
    price = post.find('span', class_='price').string

    return {
        'title': title,
        'price': price,
    }


def update_item(item_id, fields):
    """Reads an item from DB, updated fields an updated_at time, and saves it back to DB
    """

    logging.info('Updateing item_id {}'.format(item_id))

    r = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
    payload = json.loads(r.hget('cl-tracker.items', item_id))

    payload = {**payload, **fields}
    payload['updatedAt'] = str(datetime.now())

    r.hset('cl-tracker.items', item_id, json.dumps(payload))


def queue_next(item_id, url):
    """Queues next message to wait queue
    """

    logging.info('Queue next message for item_id {}'.format(item_id))

    message = json.dumps({"itemId": item_id, 'url': url})

    connection = pika.BlockingConnection(pika.URLParameters(AMQP_URL))
    channel = connection.channel()
    channel.basic_publish(
        exchange='cl-tracker',
        routing_key='wait',
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2))  # make message persistent

    connection.close()


if __name__ == '__main__':
    logging.basicConfig(filename='cl-tracker.worker.log', level=logging.INFO)

    setup_queue()
    setup_worker()
