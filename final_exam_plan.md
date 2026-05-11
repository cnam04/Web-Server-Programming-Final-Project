Add an autocomplete textbox for the add friends list

must:
- dynamically get info from server
- use a 3rd party library
- assume there is too much data in the db to download all at once
- only allow the browser to download data that is necessary to display the current options and no more
- send new requests to the webserver and download new suggestions *as* the user types in characters

use Oruga for the autocomplete

the oruga component should replace the search bar section inside the add friends sidebar. 