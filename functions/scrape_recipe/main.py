from importlib.metadata import version
from recipe_scrapers import scrape_me
from flask.json import dumps

def scrape_recipe(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if 'url' in request.args:
        try:
            scraper = scrape_me(request.args['url'], wild_mode=True)
            return (dumps(scraper.schema.data, ensure_ascii=False, indent=4 * ' '), 200, headers)
        except Exception as e:
            return (str(e), 500, headers)

    return ('Recipe Scraper: %s' % version('recipe_scrapers'), 200, headers)
