# Lyric Search History API Documentation
The Lyric Search History API provide a get function and post function to get all histories or post new histories to the data base.

## Get all search histories
**Request Format:** /data

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Return a json with all search histories

**Example Request:** /data

**Example Response:**
```json
{
  "0" : {
    "title" : "You're beautiful",
    "artist" : "James Blunt",
    "date" : "2020/5/21",
    "lyrics" : "My life is brilliant.",
    "conmment" : {
      "0" : {
        "user" : "Boundless Student",
        "content" : "Boundless!!!"
      }
    }
  }
}
```

**Error Handling:**
- Throw code 400 or 500 with "Server Error" or "Error in read file: {Error}".

## Post new search history
**Request Format:** /data

**Request Type:** POST

**Returned Data Format**: TEXT

**Description:** Post new search histories to update the search history database.
**Example Request:** /data

**Example Response:**
```
You're beautiful successfully added to jsonFile.
...
```

**Error Handling:**
- Send a "Server Error" message.
