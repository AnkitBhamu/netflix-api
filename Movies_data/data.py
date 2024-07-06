import json

new_data= []
with open("./our_data.json","r",encoding='utf-8') as file:
    data= json.load(file)
    for item in data["data"]:
        temp = {}
        print(item['title'])
        temp['name'] = item['title']
        temp['desc'] = item['desc']
        temp['thumb_img'] = item['poster']
        temp['cover_img'] = item['cover-image'].replace("/original/","/w780/")
        temp['name_img'] = ""
        temp["duration"] = "120 mins"
        temp["age_limit"] = 16
        temp['genre'] = item['genre']
        temp['year']  = item['year']
        temp['trailer'] = "https://bucket-ankit321.s3.ap-southeast-2.amazonaws.com/trailer-videos/Marvel Studios' Black Widow _ Official Trailer.mp4"
        temp['video']   = "https://bucket-ankit321.s3.ap-southeast-2.amazonaws.com/trailer-videos/Marvel Studios' Black Widow _ Official Trailer.mp4"
        temp['isSeries'] = False
        new_data.append(temp)


    


# Writing to sample.json
with open("new_data.json", "w") as outfile:
    json.dump(new_data,outfile)






