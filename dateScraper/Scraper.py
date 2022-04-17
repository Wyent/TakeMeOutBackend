import sys
from pymongo import MongoClient
from bs4 import BeautifulSoup
from selenium import webdriver
import requests
import json
import geocoder
import os  # getting heroku environment variables


class Scraper:

    @staticmethod
    def upsert_mongo(collection, search_key, insert_data):
        connect_str = 'mongodb+srv://takemeout:takemeout@takemeout.7kosh.mongodb.net/userTable?retryWrites=true&w=majority'
        cluster = MongoClient(connect_str)
        db = cluster["userTable"]
        collection = db[collection]

        collection.update_one(search_key, {'$set': insert_data}, upsert=True)

        # testing
        results = collection.find(search_key)
        for result in results:
            print(result)

    @staticmethod
    def create_headless_browser():
        # firefox_options = webdriver.FirefoxOptions()
        # firefox_options.add_argument('--headless')
        # driver = webdriver.Firefox(options=firefox_options)

        chrome_options = webdriver.ChromeOptions()
        chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")
        try:
            driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"),
                                      chrome_options=chrome_options)
        except Exception:
            driver = webdriver.Chrome(options=chrome_options)

        return driver

    @staticmethod
    def get_state_abrev(state):
        us_state_to_abbrev = {
            "Alabama": "AL",
            "Alaska": "AK",
            "Arizona": "AZ",
            "Arkansas": "AR",
            "California": "CA",
            "Colorado": "CO",
            "Connecticut": "CT",
            "Delaware": "DE",
            "Florida": "FL",
            "Georgia": "GA",
            "Hawaii": "HI",
            "Idaho": "ID",
            "Illinois": "IL",
            "Indiana": "IN",
            "Iowa": "IA",
            "Kansas": "KS",
            "Kentucky": "KY",
            "Louisiana": "LA",
            "Maine": "ME",
            "Maryland": "MD",
            "Massachusetts": "MA",
            "Michigan": "MI",
            "Minnesota": "MN",
            "Mississippi": "MS",
            "Missouri": "MO",
            "Montana": "MT",
            "Nebraska": "NE",
            "Nevada": "NV",
            "New Hampshire": "NH",
            "New Jersey": "NJ",
            "New Mexico": "NM",
            "New York": "NY",
            "North Carolina": "NC",
            "North Dakota": "ND",
            "Ohio": "OH",
            "Oklahoma": "OK",
            "Oregon": "OR",
            "Pennsylvania": "PA",
            "Rhode Island": "RI",
            "South Carolina": "SC",
            "South Dakota": "SD",
            "Tennessee": "TN",
            "Texas": "TX",
            "Utah": "UT",
            "Vermont": "VT",
            "Virginia": "VA",
            "Washington": "WA",
            "West Virginia": "WV",
            "Wisconsin": "WI",
            "Wyoming": "WY",
            "District of Columbia": "DC",
            "American Samoa": "AS",
            "Guam": "GU",
            "Northern Mariana Islands": "MP",
            "Puerto Rico": "PR",
            "United States Minor Outlying Islands": "UM",
            "U.S. Virgin Islands": "VI",
        }
        return us_state_to_abbrev.get(state)

    @staticmethod
    def get_reverse_geocode(latitude, longitude, state_abrev=False, country_abrev=False):
        g = geocoder.osm([latitude, longitude], method='reverse')
        print(json.dumps(g.json, indent=4))
        city = g.city
        state = g.state
        country = g.country
        if state_abrev:
            state = Scraper.get_state_abrev(g.state)
        if country_abrev:
            country = g.country_code

        return city, state, country

    def get_dates_meetup(self, latitude, longitude):
        import time

        # todo get lat, long from a port
        # tyler, tx
        # latitude = 32.3512601
        # longitude = -95.3010624

        # san jose
        # latitude = 37.3393857
        # longitude = -121.8949555

        # dallas
        # latitude = 32.779167
        # longitude = -96.808891

        # get geocode from lat, long
        try:
            city, state, country = self.get_reverse_geocode(latitude, longitude, country_abrev=True)
        except Exception as e:
            print(e)
            sys.exit()
        # sys.exit()
        print(city, state, country)
        '''country = 'us'
        state = 'tx'
        city = 'tyler'''

        location_string = country + '--' + state + '--' + city
        location_string.replace(" ", "+")
        html_query = 'https://www.meetup.com/find/?location='
        html_query2 = '&source=EVENTS'
        url = html_query + location_string + html_query2

        # appear as a browser
        browser = self.create_headless_browser()
        browser.get(url)

        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) '
                          'Version/9.0.2 Safari/601.3.9'}
        time.sleep(1)
        html = browser.page_source
        soup = BeautifulSoup(html, 'lxml')
        print(url)
        # unable to find location
        # todo check if string contains city, statecode
        if len(soup.select('.py-4.text-gray6.font-normal')[0].get_text()) == 22:
            location_string = country + '--' + city
            url = html_query + location_string + html_query2
            # print(url)
            browser = self.create_headless_browser()
            browser.get(url)
            time.sleep(1)
            html = browser.page_source
            soup = BeautifulSoup(html, 'lxml')

        if len(soup.select('.py-4.text-gray6.font-normal')[0].get_text()) == 22:
            print('unable to find location')
            # sys.exit()

        result_count = 0
        dates = []

        for item in soup.select('#event-card-in-search-results'):
            try:
                print('-----------Getting Event #', result_count + 1, '--------------')
                # image url
                all_imgs = item.find_all('img')
                for image in all_imgs:
                    try:
                        img_url = image['src']
                    except Exception as e:
                        img_url = None
                    # print(img_url)

                # event link
                date_url = item.get('href')
                # print(date_url)

                # date(time)
                time = item.select('time')[0].get_text()
                # print(time)

                # title
                title = item.select('.text-gray7')[0].get_text()
                # print(title)

                # group name
                group_name = item.select('.text-gray6')[0].get_text()
                # print(group_name)

                # details
                details = []
                date_page = requests.get(date_url, headers=headers)
                soup = BeautifulSoup(date_page.content, 'lxml')
                for text in soup.select('.break-words'):
                    try:
                        for paragraph in text.select('.mb-4'):
                            details.append(paragraph.get_text())
                            # print(details[-1])
                    except Exception as e:
                        print('')

                dates.append({'image': img_url, 'url': date_url, 'time': time, 'title': title, 'details': details})

                result_count += 1

                if result_count == 5:
                    break

            except Exception as e:
                # raise e
                print('')

        date_header = {
            'country': country,
            'state': state,
            'city': city,
            'source': 'meetup.com'
        }
        dates_dict = {
            'dates': dates
        }
        date_collection = date_header | dates_dict
        json_date_collection = json.dumps(date_collection, indent=4)
        print(json_date_collection)
        print('Number of results: ', result_count)

        self.upsert_mongo('dates', date_header, dates_dict)
        return date_collection

        '''client = pymongo.MongoClient(<CONNECTION STRING>)
        db = client.<DATABASE>
        collection = db.<COLLECTION>

        result = collection.bulk_write(json_date_collection)
        client.close()'''
