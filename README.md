# cl-tracker

A Craigslist item/search tracker

## Install

- `brew install redis` - install redis
- `brew install rabbitmq` - install RabbitMQ
- `brew install pipenv` - install python package/virtual environment manager

## Usage

- `rabbitmq-server` - start RabbitMQ server
- `redis-server` - start redis server
- `pipenv run python worker.py` - run worker

## Development

- `pipenv install <package-name>` - install a package
- `pipenv lock` - lock package versions
- `pipenv run <file-name>` - run a file in pipenv (or `pipenv shell` to activate a virtualenv)
- `tail -f cl-tracker.worker.log` - tail worker logs

## Components

### Storage

Information regarding an item is stored in redis using a single key named `cl-tracker.<item_id>`. The value of the key is a JSON of the following format:

```
{
  "itemId": <uuid>,
  "inserted_at": <datetime>,
  "url": <string>,
  "title": <string>,
  "price": <string>,
  "expired": <boolean>,
  "updated_at": <datetime>
}
```

### Queue

Jobs are queued on a job queue named `cl-tracker.worker`. All repeating jobs are scheduled using a delay queue called `cl-tracker.wait` with a message TTL of 60 seconds. The delay queue is configured to re-route messages to the work queue on expiry using a simple single exchange dead-lettering.

### Worker

The worker consumes messages from the job queue, fetches posts, parses and extracts relevant fields, and saves to DB. The worker is also responsible for creating the AMQP exchange, queues and bindings.
