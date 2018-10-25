# cl-tracker

A Craigslist item/search tracker

## Install

- `brew install postgres` - install postgresql

## Usage

- `make schema` & `make db` - create database schema

## Development

- `brew services start postgresql` - start postgres

## Components

### Scraper

Fetches posts, parses and extracts relevant fields, and saves to DB.

### SQL

Schema of persisted data.

### Producer

Schedules repeating jobs.

### Worker

Consumes producer created jobs asynchronously.
