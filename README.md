# cl-tracker

A Craigslist item/search tracker

### Scraper

Fetches posts, parses and extracts relevant fields, and saves to DB.

### SQL

Schema of persisted data.

### Producer

Schedules repeating jobs.

### Worker

Consumes producer created jobs asynchronously.
