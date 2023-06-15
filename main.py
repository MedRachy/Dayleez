from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import requests

# set credentials + initialize
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "dayleez-xxx",
    "private_key_id": "xxxxx",
    "private_key": "-----BEGIN PRIVATE KEY-----\xxxxxxx\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xxxxxx.iam.gserviceaccount.com",
    "client_id": "xxxxx",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxxx.iam.gserviceaccount.com"
})
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://dayleez-d450e-default-rtdb.firebaseio.com/'
})

# root url
BaseURL = "https://www.jumia.ma"

items = []

# for x in range(1, 3):
response = requests.get(
    'https://www.jumia.ma/mlp-toutes-les-boutiques-officielles/')
page_content = BeautifulSoup(response.content, "html.parser")
itemslist = page_content.find_all('article', class_="prd _fb col c-prd")
for item in itemslist:
    name = item.find('h3', class_='name').text.strip()
    price = item.find('div', class_='prc').text.strip()
    try:
        oldprice = item.find('div', class_='old').text.strip()
    except:
        oldprice = ''
    try:
        review = item.find('div', class_='rev').text.strip()
    except:
        review = ''
    img_url = item.find('img')['data-src']
    store = 'Jumia'
    item_url = item.find('a')['href']
    item_url = BaseURL + item_url
    itemdata = {
        "name": name,
        "price": price,
        "oldprice": oldprice,
        "img_url": img_url,
        "store": store,
        "review": review,
        "item_url": item_url,
        "likes": 0
    }

    items.append(itemdata)


print(len(items))

ref = db.reference('/items')
ref.set(items)
# ref.delete()
