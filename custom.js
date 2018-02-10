const rawItems = localStorage.getItem("items") || "[]";
var items = JSON.parse(rawItems).map(i => ({
  ...i,
  time: new Date(i.time)
}));

const setText = text => (document.getElementById("content").innerHTML = text);

const getLocation = handler => {
  navigator.geolocation.getCurrentPosition(function(position) {
    handler(position.coords.latitude, position.coords.longitude);
  });
};

getLocation();

const setButtonText = text =>
  (document.getElementById("addButton").innerHTML = text);

const generateMapLink = loc => '<a href="' + generateMapURL(loc) + '">Map</a>';
const generateLocString = loc => loc[0] + "," + loc[1];
const generateMapURL = loc =>
  "http://maps.google.com/maps?q=" +
  generateLocString(loc) +
  "&ll=" +
  generateLocString(loc) +
  "z=17";

const formatDate = date => {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var minute = date.getMinutes();
  if (minute < 10) {
    minute = "0" + minute;
  }
  var hour = date.getHours();
  if (hour < 10) {
    hour = "0" + hour;
  }
  return monthNames[monthIndex] + " " + day + ", " + hour + ":" + minute;
};

const generateRow = item =>
  "<tr>" +
  "<td>" +
  "<input type='checkbox' class='messageCheckbox' data-id='" +
  item.id +
  "'/>" +
  "</td>" +
  "<td>" +
  item.title +
  "</td>" +
  "<td>" +
  item.amount +
  " Ft </td>" +
  "<td>" +
  formatDate(item.time) +
  "</td>" +
  "<td>" +
  generateMapLink(item.loc) +
  "</td>" +
  "</tr>";

const generateTableRows = items => items.map(generateRow).join("\n");
const generateTable = items =>
  "<table>" + generateTableRows(items) + "</table>";

const sortItems = () => {
  items.sort((l, r) => l.time < r.time);
};

const saveItems = () => localStorage.setItem("items", JSON.stringify(items));

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const onAdd = event => {
  setButtonText("Getting location...");
  const text = document.getElementById("inputTitle").value;
  const value = document.getElementById("inputValue").value;
  getLocation((lat, long) => {
    const time = new Date().getUTCDate();
    items.push({
      loc: [lat, long],
      time: new Date(),
      id: uuidv4(),
      title: text,
      amount: value
    });
    saveItems();
    sortItems();
    render();
    setButtonText("Add");
  });
};

console.log(items);

const onRemoveAll = event => {
  items = [];
  saveItems();
  render();
};

const onRemove = event => {
  const inputElements = document.getElementsByClassName("messageCheckbox");
  const removeIDs = [];
  for (var i = 0; inputElements[i]; ++i) {
    const checkedValue = inputElements[i].checked;
    const id = inputElements[i].getAttribute("data-id");
    if (checkedValue) {
      removeIDs.push(id);
    }
  }
  items = items.filter(item => !removeIDs.includes(item.id));
  saveItems();
  render();
};

const render = () => {
  document.getElementById("items").innerHTML = generateTable(items);
};

document.getElementById("addButton").addEventListener("click", onAdd);
document.getElementById("removeButton").addEventListener("click", onRemove);
document
  .getElementById("removeAllButton")
  .addEventListener("click", onRemoveAll);

sortItems();
render();
