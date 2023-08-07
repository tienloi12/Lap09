var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());

var admin = require("firebase-admin");
var serviceAccount = require("./lap09-6ae0d-firebase-adminsdk-1pk9g-bcb66930c5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lap09-6ae0d-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();
const ref = db.ref("SensorData");

app.get('/SensorData', function (req, res) {
    ref.once("value", function (snapshot) {
      const data = snapshot.val();
      const dataArray = Object.values(data); // Chuyển đổi đối tượng sang mảng
      res.send(dataArray);
      console.log(dataArray);
  
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      res.status(500).json({ error: "Có lỗi xảy ra khi lấy dữ liệu" });
   
    });
  }); 
  
  
  
  
  app.get('/SensorData/:id', function (req, res) {
    const { id } = req.params;
    ref.orderByChild("id").equalTo(id).once("value")
      .then((snapshot) => {
        const sensordata = snapshot.val();
        if (sensordata) {
          res.send(sensordata);
          console.log(sensordata);
        } else {
          res.status(404).json({ error: "Không tìm thấy sách" });
        }
      })
      .catch((error) => {
        console.log("The read failed: " + error.code);
        res.status(500).json({ error: "Có lỗi xảy ra khi lấy dữ liệu" });
      });
  });
  
  
  
  app.post('/SensorData', function (req, res) {
    const {id, temperature, humid , time , farmid } = req.body;
  
    const newSensorData = {
        id: id,
        temperature: temperature,
        humid: humid,
        time: time,
        farmid: farmid
    };
  
    ref.push(newSensorData)
      .then(() => {
        res.status(201).json({ success: "Thêm dữ liệu thành công" });
      })
      .catch((error) => {
        console.error("Lỗi khi thêm dữ liệu:", error);
        res.status(500).json({ error: "Có lỗi xảy ra khi thêm dữ liệu" });
      });
  });

  
var server = app.listen(1234, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});