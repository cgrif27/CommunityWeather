const functions = require("firebase-functions");
const firebase = require("firebase-admin");

firebase.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.deleteCaption = functions.firestore
  .document("/posts/{range}/captions/{doc}")
  .onDelete((snap, context) => {
    console.log("New functions is running and deleting");
    const id = snap.id;
    let docId = snap.id;
    let docNum = snap.data().docNum;
    let rangeIndex = snap.data().tempRangeIndex;
    const tempRanges = ["-0", "0-18", "18-24", "24-27", "27-35", "35+"];

    // const docRef = firebase
    //   .firestore()
    //   .collection("posts")
    //   .doc(tempRanges[rangeIndex])
    //   .collection("captions")
    //   .doc(docId);

    firebase
      .firestore()
      .collection("posts")
      .doc(tempRanges[rangeIndex])
      .collection("captions")
      .where("docNum", ">", docNum)
      .get()
      .then((docs) => {
        //subtract 1 from all docNums on all the documents greater then the one deleted

        docs.forEach((data) => {
          //get all the doc paths
          firebase
            .firestore()
            .collection("posts")
            .doc(tempRanges[rangeIndex])
            .collection("captions")
            .doc(data.id)
            .update({
              docNum: data.data().docNum - 1,
            });
        });

        //updating the count on the size document
        const sizeRef = firebase
          .firestore()
          .collection("posts")
          .doc(tempRanges[rangeIndex])
          .collection("captions")
          .doc("size");
        sizeRef
          .get()
          .then((data) => {
            sizeRef
              .update({
                count: data.data().count - 1,
              })
              .catch((e) => console.log(e));
            return data;
          })
          .catch((e) => console.log(e));
        return docs;
      })

      .catch((e) => console.log(e));
    return doc;
  });
