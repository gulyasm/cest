const rawItems = localStorage.getItem("items") || "[]";
const selectedItems = [];
var items = JSON.parse(rawItems).map(i => ({
  ...i,
  time: new Date(i.time)
}));

const setText = text => (document.getElementById("content").innerHTML = text);

const getLocation = handler =>
  navigator.geolocation.getCurrentPosition(handler);

const setButtonText = text =>
  (document.getElementById("addButton").innerHTML = text);

const generateMapLink = loc => `<a href="${generateMapURL(loc)}">Map</a>`;
const generateLocString = loc => loc[0] + "," + loc[1];
const generateMapURL = loc =>
  `http://maps.google.com/maps?
  q=${generateLocString(loc)}
  &ll=${generateLocString(loc)}
  &z=17`;

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

const onRowClick = id => {
  const index = selectedItems.indexOf(id);
  if (index >= 0) {
    selectedItems.splice(index, 1);
  } else {
    selectedItems.push(id);
  }
  render();
};

const generateTrClass = item => {
  if (selectedItems.includes(item.id)) {
    return "selected";
  }
  return "";
};

const generateRow = item =>
  `<tr onclick='onRowClick("${item.id}");' class='${generateTrClass(item)}'>` +
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

const generateTable = items => `<table>${generateTableRows(items)}</table>`;

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
  getLocation(({ lat, long }) => {
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

const onRemoveAll = event => {
  items = [];
  saveItems();
  render();
};

const onRemove = event => {
  const inputElements = document.getElementsByClassName("messageCheckbox");
  items = items.filter(item => !selectedItems.includes(item.id));
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

getLocation(() => {});
sortItems();
render();
