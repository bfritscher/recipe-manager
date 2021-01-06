from recipe_scrapers import scrape_me

urls = [
    'https://migusto.migros.ch/fr/recettes/boeuf-wellington',
    'https://fooby.ch/en/recipes/20616/lentil-and-mushroom-stew-with-celeriac-mash?startAuto1=0',
    'https://www.swissmilk.ch/fr/recettes-idees/recettes/Chinoisesauce_01_2012/sauce-au-curry-fondue-chinoise-ou-dip/?collection=120107&index',
    'https://recipeland.com/recipe/v/bacon-maple-scones-55990?metric=true',
    'https://ww2.bettybossi.ch/de/Rezept/ShowRezept/BB_BBKN201124_0001A-80-de',
]


import json

# for url in urls:
#     print(url)
#     scraper = scrape_me(url, wild_mode=True)
#     print(json.dumps(scraper.schema.data))
#     break


import extruct
import requests
import pprint
from w3lib.html import get_base_url

pp = pprint.PrettyPrinter(indent=2)
r = requests.get('https://migusto.migros.ch/fr/recettes/boeuf-wellington')
base_url = get_base_url(r.text, r.url)
data = extruct.extract(r.text, base_url=base_url)

pp.pprint(json.dumps(data['json-ld'], ensure_ascii=False).replace(u'\xa0', u' '))

