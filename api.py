import json
import logging
import pika
import redis
import uuid
from datetime import datetime
from flask import Flask
from flask_restful import Resource, reqparse, Api

REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0

AMQP_URL = 'amqp://guest:guest@localhost:5672'


def get_redis():
    return redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)


def publish_message(routing_key, message):
    connection = pika.BlockingConnection(pika.URLParameters(AMQP_URL))
    channel = connection.channel()
    channel.basic_publish(
        exchange='cl-tracker',
        routing_key=routing_key,
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2))  # make message persistent

    connection.close()


class ItemList(Resource):
    def get(self):
        """List all items in DB
        """

        logging.info('List items')

        r = get_redis()
        items = r.hvals('cl-tracker.items')

        return list(map(json.loads, items))

    def post(self):
        """Add new item to DB
        """

        logging.info('Add new item')

        args = parser.parse_args()
        url = args['url']

        item_id = str(uuid.uuid4())
        item = {
            'itemId': item_id,
            'insertedAt': str(datetime.now()),
            'url': url,
            'expired': False,
        }

        r = get_redis()
        r.hset('cl-tracker.items', item_id, json.dumps(item))

        message = json.dumps({"itemId": item_id, 'url': url})
        publish_message('worker', message)

        return item_id, 201


class Item(Resource):
    def put(self, item_id):
        """Update item - send a new message to worker
        """

        logging.info('Update item')

        r = get_redis()
        item = json.loads(r.hget('cl-tracker.items', item_id))
        url = item['url']

        message = json.dumps({"itemId": item_id, 'url': url})
        publish_message('worker', message)

        return '', 201

    def delete(self, item_id):
        """Delete an item
        """

        logging.info('Delete item')

        r = get_redis()
        r.hdel('cl-tracker.items', item_id)

        return '', 204


if __name__ == '__main__':
    logging.basicConfig(filename='cl-tracker.api.log', level=logging.INFO)

    app = Flask(__name__)
    api = Api(app)

    parser = reqparse.RequestParser()
    parser.add_argument('url')

    api.add_resource(ItemList, '/items')
    api.add_resource(Item, '/items/<string:item_id>')

    app.run()
