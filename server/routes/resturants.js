const router = require("express").Router();
const Restaurant = require("../model/restaurants");
const Customer = require("../model/customer");
const mongoose = require("mongoose");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "./uploads/");
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("resturanturl"), (req, res) => {
  console.log(req.file);
  const _id = mongoose.Types.ObjectId();

  const rName = req.body.restaurantName;
  const rRStatus = req.body.restaurantRegistrationStatus;
  const imgurl = req.file.path;
  const rPhone = req.body.restaurantPhone;
  const rEmail = req.body.restaurantEmail;
  const rCity = req.body.rCity;
  const rating = req.body.rating;
  const cuisine = req.body.cuisine;
  const reviewText = req.body.reviewText;
  const user = req.body.user;
  const username = req.body.username;
  const menuName = req.body.menuName;
  const menuPrice = req.body.menuPrice;
  const newRestaurant = new Restaurant({
    _id: _id,
    restaurantName: rName,
    restaurantRegistrationStatus: rRStatus,
    resturanturl: imgurl,
    restaurantPhone: rPhone,
    restaurantEmail: rEmail,
    rCity: rCity,
    rating: rating,
    cuisine: cuisine,
    reviews: {
      _id: mongoose.Types.ObjectId(),
      reviewText: reviewText,
      user: user,
      username: username,
    },
    menus: {
      menuID: mongoose.Types.ObjectId(),
      menuName: menuName,
      menuPrice: menuPrice,
    },
  });
  newRestaurant
    .save()
    .then((savedResturant) => {
      res.json(savedResturant);
    })
    .catch((err) => console.log("error ", err));
});

router.get("/", (req, res) => {
  Restaurant.find({}).then((data) => res.json(data));
});

router.post("/addReview", (req, res) => {
  let reviews = [];
  const id = req.body.rID;

  Restaurant.findById(id)
    .then((restaurant) => {
      reviews = restaurant.reviews;
      reviews.push({
        menuID: mongoose.Types.ObjectId(),
        reviewText: req.body.reviewText,
        user: req.body.user,
        username: req.body.username,
      });
      Restaurant.findOneAndUpdate(
        { _id: id },
        { reviews: reviews },
        { new: true, upsert: false }
      )
        .then((doc) => {
          console.log(doc);
          res.json(doc);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.patch("/:rID", (req, res) => {
  const id = req.params.rID;
  Restaurant.findByIdAndUpdate(
    { _id: id },
    {
      restaurantName: req.body.restaurantName,
      restaurantPhone: req.body.restaurantPhone,
      restaurantEmail: req.body.restaurantEmail,
    }
  )
    .then((data) => res.json(data))
    .catch((err) => console.log("Caught:", err.message));
});

router.get("/:restaurantid", (req, res) => {
  const _id = req.params.restaurantid;
  Restaurant.findById(_id)
    .then((data) => res.json(data))
    .catch((err) => console.log("Caught:", err.message));
});

router.delete("/:restaurantid", (req, res) => {
  Restaurant.findByIdAndRemove(req.params.restaurantid)
    .then(res.json({ msg: "delete success!" }))
    .catch(res.json({ msg: "delete err!" }));
});

// Get all items from menus
router.get("/menu/:rid/", (req, res) => {
  Restaurant.findById(req.params.rid)
    .then((data) => res.json({ menus: data.menus }))
    .catch((err) => res.json({ "error while fetching menu": err }));
});

//to update menu
router.patch("/menu/:menuID", (req, res) => {
  Restaurant.findOneAndUpdate(
    { "menus._id": req.params.menuID },
    {
      $set: {
        menus: {
          menuName: req.body.menuName,
          menuPrice: req.body.menuPrice,
        },
      },
    }
  )
    .then((data) => res.json(data))
    .catch((err) => res.json({ err: err }));
});

// Add items to menus
router.post("/menu", (req, res) => {
  let menus = [];
  const id = req.body.rID;

  Restaurant.findById(id)
    .then((restaurant) => {
      menus = restaurant.menus;
      menus.push({
        menuID: mongoose.Types.ObjectId(),
        menuName: req.body.menuName,
        menuPrice: req.body.menuPrice,
      });
      console.log(products);
      Restaurant.findOneAndUpdate(
        { _id: id },
        { menus: menus },
        { new: true, upsert: false }
      )
        .then((doc) => {
          console.log(doc);
          res.json(doc);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.delete("/menu/:menuId", (req, res) => {
  const _id = req.params.menuId;
  Restaurant.findByIdAndRemove(_id)
    .then(res.json({ msg: "delete success!" }))
    .catch(res.json({ msg: "delete err!" }));
});

module.exports = router;
