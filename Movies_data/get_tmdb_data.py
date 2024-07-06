import requests
import json
import time


def get_images_data(m_id):
    url = f'https://api.themoviedb.org/3/movie/{m_id}/images?include_image_language=en'
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjNlZWQ1YmNiNTE4ZjRhYjdkZDU2NTRhOGI0MzZkMiIsIm5iZiI6MTcxOTY1MjA1MC44OTY5Mywic3ViIjoiNjY3ZmNkYmM2ZTRlMWU5ZDEwNWJlM2ZlIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.Zo_5C7U2c9IdCSQY2ftJnNetD28oJOab-aXhzXR10Q0"
    }
    response = requests.get(url, headers=headers)
    response = response.json()

    poster = f'https://image.tmdb.org/t/p/original{response["posters"][0]["file_path"]}'
    bckdp = f'https://image.tmdb.org/t/p/original{response["backdrops"][0]["file_path"]}'
    name = f'https://image.tmdb.org/t/p/original{response["logos"][0]["file_path"]}'

    return (poster,bckdp,name)



def get_movie_details(m_id):
    url = f'https://api.themoviedb.org/3/movie/{m_id}?language=en-US'
    print("Url is : ",url)
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjNlZWQ1YmNiNTE4ZjRhYjdkZDU2NTRhOGI0MzZkMiIsIm5iZiI6MTcxOTY1MjA1MC44OTY5Mywic3ViIjoiNjY3ZmNkYmM2ZTRlMWU5ZDEwNWJlM2ZlIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.Zo_5C7U2c9IdCSQY2ftJnNetD28oJOab-aXhzXR10Q0"
    }

    response = requests.get(url, headers=headers)
    return response.json()
    # print("movie_details are : ",response.json())

def extract_genres(genres_list):
    genre = ""
    for i in range(0,len(genres_list)):
        if(i == len(genres_list)-1):
            genre += genres_list[i]['name']
        
        else:
          genre = genres_list[i]['name']+","

    return genre


def create_new_data(data):
    new_data= []
    for item in data["rows"]:
        try:
            m_data= get_movie_details(item['tmdb_id'])
            m_img_data = get_images_data(item['tmdb_id'])
            temp = {}
            temp['name'] = m_data['original_title']
            temp['desc'] = item['description']
            temp['thumb_img'] = m_img_data[0]
            temp['cover_img'] = m_img_data[1]
            temp['name_img'] = m_img_data[2]
            temp["duration"] = "120 mins"
            temp["age_limit"] = 16
            temp['genre'] = extract_genres(m_data['genres'])
            temp['year']  = item['year']
            temp['trailer'] = "https://bucket-ankit321.s3.ap-southeast-2.amazonaws.com/trailer-videos/Marvel Studios' Black Widow _ Official Trailer.mp4"
            temp['video']   = "https://bucket-ankit321.s3.ap-southeast-2.amazonaws.com/trailer-videos/Marvel Studios' Black Widow _ Official Trailer.mp4"
            temp['isSeries'] = False
            new_data.append(temp)

        except:
            continue
    
    with open("new_data.json", "w") as outfile:
        json.dump(new_data,outfile)


with open("data.json","r",encoding="utf-8") as file:
    temp = json.load(file)
    create_new_data(temp)




