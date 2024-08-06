// for login th euser
const router = require("express").Router();
const Movies = require("../Schemas/Movies");
const Lists = require("../Schemas/List");
const path = require("path");
var AWS = require("aws-sdk");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function authorize_user(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    res.status(404).json("Authorization failed!!");
  } else {
    let token = req.headers.authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.SECRET_KEY);
      next();
    } catch (err) {
      res.status(404).json("Authorization failed!!");
    }
  }
}

// initiliase our aws client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// upload the files
async function uploadFilesAWS(file, object_name) {
  let params = {
    Bucket: "bucket-ankit321",
    Key: object_name + "/" + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();
}

// delete files to aws also
async function deleteAWS(data) {
  // console.log("data to be deleted is : ", data);
  let params = {
    Bucket: "bucket-ankit321",
    Delete: {
      Objects: [
        { Key: "cover-images/" + data[0] },
        { Key: "thumb-images/" + data[1] },
        { Key: "name-images/" + data[2] },
        { Key: "main-videos/" + data[3] },
        { Key: "trailer-videos/" + data[4] },
      ],
    },
  };
  await s3.deleteObjects(params).promise();
}

// upload files to aws
router.use("/upload", upload.array("files", 5));
router.post("/upload", async (req, res) => {
  try {
    let files = req.files;
    await uploadFilesAWS(files[0], "cover-images");
    await uploadFilesAWS(files[1], "thumb-images");
    await uploadFilesAWS(files[2], "name-images");
    await uploadFilesAWS(files[3], "main-videos");
    await uploadFilesAWS(files[4], "trailer-videos");
    res.status(200).json("Upload data on AWS is success!!");
  } catch (err) {
    res.status(404).json(err);
  }
});

router.post("/deleteAWS", async (req, res) => {
  try {
    let content_data = [];
    content_data.push(path.basename(req.body.cover_img));
    content_data.push(path.basename(req.body.thumb_img));
    content_data.push(path.basename(req.body.name_img));
    content_data.push(path.basename(req.body.video));
    content_data.push(path.basename(req.body.trailer));
    await deleteAWS(content_data);
    // console.log("Done!!");
    res.status(200).json("Movie deleted from the AWS also!!");
  } catch (err) {
    res.status(200).json(err);
  }
});

function updateUrls(item) {
  item.cover_img =
    process.env.BUCKET_URL + "/cover-images/" + path.basename(item.cover_img);
  item.thumb_img =
    process.env.BUCKET_URL + "/thumb-images/" + path.basename(item.thumb_img);
  item.name_img =
    process.env.BUCKET_URL + "/name-images/" + path.basename(item.name_img);
  item.video =
    process.env.BUCKET_URL + "/main-videos/" + path.basename(item.video);
  item.trailer =
    process.env.BUCKET_URL + "/trailer-videos/" + path.basename(item.trailer);
}

// CREATE new Movies only if we are admin
router.post("/create", async (req, res) => {
  updateUrls(req.body);
  let movie = new Movies(req.body);
  try {
    await movie.save();
    res.status(200).json(movie._doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a movie
router.post("/delete", async (req, res) => {
  let id = req.body.id;
  try {
    await Movies.findByIdAndDelete(id, { new: "true" });
    res.status(200).json("Movie deleting is success!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET
router.get("/moviebyId/:id", async (req, res) => {
  try {
    let movie = await Movies.findById(req.params.id);

    if (movie) {
      res.status(200).json(movie);
    } else res.status(404).json("Movie-not-found");
  } catch (error) {
    res.status(404).json("Movie-not-found");
  }
});

// GET A RANDOM MOVIE or series FOR PREVIEWING
router.get("/preview/:type", authorize_user, async (req, res) => {
  let type = req.params.type;
  try {
    let contents = [];
    if (type === "movies") contents = await Movies.find({ isSeries: false });
    else contents = await Movies.find({ isSeries: true });

    if (contents.length != 0) {
      let chosen_content =
        contents[Math.floor(Math.random() * contents.length)];
      res.status(200).json(chosen_content._doc);
    } else throw "Query result not found!!";
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/preview2/:type", authorize_user, async (req, res) => {
  let type = req.params.type;
  try {
    let contents = [];
    if (type === "movies") contents = await Movies.find({ isSeries: false });
    else contents = await Movies.find({ isSeries: true });

    if (contents.length != 0) {
      const shuffle = ([...arr]) => {
        let m = arr.length;
        while (m) {
          const i = Math.floor(Math.random() * m--);
          [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
      };

      let chosen_content = shuffle(contents).slice(0, 3);

      let data = chosen_content.map((item, index) => item._doc);

      // let chosen_content =
      //   contents[Math.floor(Math.random() * contents.length)];
      res.status(200).json(data);
    } else throw "Query result not found!!";
  } catch (err) {
    res.status(404).json(err);
  }
});

// GET ALL movies for the admin level
router.get("/getAll", async (req, res) => {
  try {
    let contents = [];
    contents = await Movies.find({}, null, {
      sort: { name: 1 },
    });

    let response = {};
    response["data"] = contents.map((element) => element._doc);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json(err);
  }
});

// GET ALL lists for the admin level
router.get("/listsAll", authorize_user, async (req, res) => {
  try {
    let contents = [];
    contents = await List.find({}, null, {
      sort: { name: 1 },
    });

    let response = {};
    response["data"] = contents.map((element) => element._doc);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json(err);
  }
});

// create lists
router.post("/createList", async (req, res) => {
  let type = req.body;

  let n_list = new Lists(req.body);

  try {
    await n_list.save({ new: true });
    res.status(200).json("List created successfully!!");
  } catch (err) {
    res.status(404).json("Error in the request");
  }
});

// Delete a list
router.post("/deleteList", async (req, res) => {
  let id = req.body.id;
  try {
    await Lists.findByIdAndDelete(id, { new: "true" });
    res.status(200).json("List deleting is success!!");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/listsAll/:type", authorize_user, async (req, res) => {
  try {
    let contents = [];
    contents = await Lists.find(
      { type: req.params.type === "movies" ? "movies" : "series" },
      null,
      {
        sort: { name: 1 },
      }
    );

    let response = {};
    response["data"] = contents.map((element) => element._doc);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json(err);
  }
});

// get content lists;
router.get("/lists:type", async (req, res) => {
  let type = req.params.type;

  try {
    let all_lists = await Lists.find({ type: type });
    let response_data = all_lists.map((element) => {
      return element._doc;
    });

    if (response_data.length != 0) {
      res.status(200).json({ data: response_data });
    } else throw "Not found";
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
