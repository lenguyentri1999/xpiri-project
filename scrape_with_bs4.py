import requests
import json
from bs4 import BeautifulSoup

url = "http://food.unl.edu/food-storage-chart-cupboardpantry-refrigerator-and-freezer"
r = requests.get(url)
soup = BeautifulSoup(r.content, "html.parser")
infoTable = soup.find_all("td")
td_tag_arr = []
for td_tag in infoTable:
    td_tag = td_tag.encode("utf8")
    if "span" in td_tag:
        continue
    else:
        td_tag_arr.append(td_tag)


j = 0
food_arr = []
room_temp_arr = []
ref_arr = []
froze_arr = []
while (j < len(td_tag_arr)):
    td_tag_arr[j] = td_tag_arr[j].replace("<td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("</td>", "")
    food_arr.append(td_tag_arr[j])
    j += 1
    td_tag_arr[j] = td_tag_arr[j].replace("<td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("</td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("\xc2\xa0", "N/A")
    td_tag_arr[j] = td_tag_arr[j].replace("<br/>", " or")
    room_temp_arr.append(td_tag_arr[j])
    j += 1
    td_tag_arr[j] = td_tag_arr[j].replace("<td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("</td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("\xc2\xa0", "N/A")
    td_tag_arr[j] = td_tag_arr[j].replace("<br/>", " or")
    ref_arr.append(td_tag_arr[j])
    j += 1
    td_tag_arr[j] = td_tag_arr[j].replace("<td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("</td>", "")
    td_tag_arr[j] = td_tag_arr[j].replace("\xc2\xa0", "N/A")
    td_tag_arr[j] = td_tag_arr[j].replace("<br/>", " or")
    froze_arr.append(td_tag_arr[j])
    j += 1


# BUILDING A JSON OBJECT FOR REGRIGERATED FOOD
data = {}
i = 0
while (i < len(food_arr)):
    data[food_arr[i] + " (room temperature)"] = room_temp_arr[i]
    json_data = json.dumps(data)
    i += 1
print(json_data)
