import requests
import json
import time
import pandas as pd

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


def get_cast_details(m_id):
    # print("cast movie id is : ",m_id)
    url = f'https://api.themoviedb.org/3/movie/{m_id}/credits?language=en-US'
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjNlZWQ1YmNiNTE4ZjRhYjdkZDU2NTRhOGI0MzZkMiIsIm5iZiI6MTcxOTg1NjM3My4wOTk2OTcsInN1YiI6IjY2N2ZjZGJjNmU0ZTFlOWQxMDViZTNmZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NuclbrFUTFh6Gg-JBmZEbFtDCIfG49hC62tgj8OMqY0"
    }
    response = requests.get(url, headers=headers).json()

    casts = []
    for item in response['cast']:
        temp ={}
        temp['original_name'] = item['original_name']
        temp['character'] = item['character']
        temp['profile_pic']  = f'https://image.tmdb.org/t/p/original{item["profile_path"]}'
        casts.append(temp)
    
    crews = []
    for item in response['crew']:
        temp ={}
        temp['original_name'] = item['original_name']
        temp['job'] = item['job']
        temp['profile_pic']  = f'https://image.tmdb.org/t/p/original{item["profile_path"]}'
        crews.append(temp)

    
    return (casts,crews)



def get_movie_details(m_id):
    url = f'https://api.themoviedb.org/3/movie/{m_id}?language=en-US'
    # print("Url is : ",url)
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

def create_new_data():
    df = pd.read_csv("./tmdb_5000_movies.csv")
    new_data= []
    new_crew_data = []
    for i in range(150):
        item = df.iloc[i]
        print(i+1)
        try:
            m_data= get_movie_details(item['id'])
            m_img_data = get_images_data(item['id'])
            cast,crew = get_cast_details(item['id'])
            temp ={}
            temp['name'] = m_data['original_title']
            temp['desc'] = item['overview']
            temp['thumb_img'] = m_img_data[0]
            temp['cover_img'] = m_img_data[1]
            temp['name_img'] = m_img_data[2]
            temp["duration"] = str(item['runtime']) + "mins"
            temp["age_limit"] = 16
            temp['genre'] = extract_genres(m_data['genres'])
            temp['year']  = m_data["release_date"].split("-")[0]
            temp['trailer'] = "https://videos.pexels.com/video-files/4763873/4763873-uhd_2560_1440_24fps.mp4"
            temp['video']   = "https://videos.pexels.com/video-files/4763873/4763873-uhd_2560_1440_24fps.mp4"
            temp['isSeries'] = False
            temp['cast'] = cast
            temp['crew'] = crew
            # print(temp)
            new_data.append(temp)

        except:
            print("err")
            continue
    
    with open("new_data2.json", "w") as outfile:
        json.dump(new_data,outfile)


create_new_data()




