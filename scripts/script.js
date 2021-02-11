function loadGraph(data, graph) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'time');
    dataTable.addColumn('number', 'Customer');

    for (var i = 0; i < data.length; i++) {
        var dateObj = new Date(data[i].timestamp * 1000);
        var timestamp = dateObj.getHours() + ":" + dateObj.getMinutes();// + ":" + dateObj.getSeconds();
        var count = parseInt(data[i].count);

        dataTable.addRows([
            [timestamp, count]
        ]);
    }
    var options = {
        legend: 'none',
        width: 600,
        height: 400,
        backgroundColor: '#fdb812',
        colors: ['#ffffff'],
        hAxis: {
            title: 'Time'
        },
        vAxis: {
            //gridlines: {color: '#000000'},
            title: '# of Request'
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById(graph));
    chart.draw(dataTable, options);
}

function getDateString(number) {
    return (number.toString().length == 2 ? '' : '0') + number
}


var interval = null;

function arrivalRateGraph(id) {
    var className = document.getElementById(id).className;
    var loader2 = document.getElementsByClassName(className)[10].id;
    var loader2ID = document.getElementById(loader2);

    var graph = document.getElementsByClassName(className)[11].id;
    var lineGraph = document.getElementById(graph);

    loader2ID.style.display = "block";

    if (document.getElementById(id) == null) {
        return
    }
    var selected = document.getElementById(id).selectedIndex;
    var queue_id = document.getElementsByTagName("option")[selected].value;
    if (queue_id == "Select Queue ID") {
        return
    }
    var className = document.getElementById(id).className;
    var network = document.getElementsByClassName(className)[7].id;
    var networkID = document.getElementById(network);


    var duration = 3
    var time = new Date();
    // from has to be in the past, not now
    time.setMinutes(time.getMinutes() - duration)
    var offset = time.getTimezoneOffset() * (-1) / 60;
    var from = time.getFullYear() +
        '-' + getDateString(time.getMonth() + 1) +
        '-' + getDateString(time.getDate()) +
        'T' + getDateString(time.getHours()) +
        ':' + getDateString(time.getMinutes()) +
        ':' + getDateString(time.getSeconds()) +
        (offset >= 0 ? '+' : '-') +
        getDateString(offset) + ':00';

    axios.get(`https://ades-2b02.herokuapp.com/company/arrival_rate/`, {
        params: {
            queue_id,
            from,
            duration
        }
    }).then(function (res) {
        networkID.style.display = "none";
        loader2ID.style.display = "none";

        // Load google charts
        var line_graph = document.getElementsByClassName(className)[11].id;
        if (document.getElementById(line_graph).childElementCount == 0) {
            interval = setInterval(function () { arrivalRateGraph(id) }, 3000);
        }
        google.charts.setOnLoadCallback(loadGraph(res.data, line_graph));
        lineGraph.style.display = "block";


    }).catch(function (error) {

        if (error.message == 'Network Error') {
            networkID.style.display = "block";
        }
    });
}

var i = 0;
var j = i;
function addTrackerContainer() {
    var trackerRow = document.getElementById("trackerRow");

    var trackerContainer = document.createElement("div");
    trackerContainer.setAttribute("class", "col-xs-12 col-sm-6");
    trackerContainer.setAttribute("id", ++i);
    trackerContainer.innerHTML = document.getElementById("trackerHTML").innerHTML;

    var buttonDiv = document.getElementById("buttonDiv");
    trackerRow.insertBefore(trackerContainer, buttonDiv);

    var removeTracker = document.getElementById("removeTracker");
    removeTracker.setAttribute("class", "tracker" + ++j); //[0]
    removeTracker.setAttribute("id", j);

    var companyIDForm = document.getElementById("companyIDForm");
    companyIDForm.setAttribute("class", "tracker" + j); //[1]
    companyIDForm.setAttribute("id", "form" + j);

    companyIDForm.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    var companyIDInput = document.getElementById("companyIDInput");
    companyIDInput.setAttribute("class", "tracker" + j); //[2]
    companyIDInput.setAttribute("id", "formInput" + j);

    var searchButton = document.getElementById("searchButton");
    searchButton.setAttribute("class", "tracker" + j); //[3]
    searchButton.setAttribute("id", "search" + j);

    var loader = document.getElementById("loader");
    loader.setAttribute("class", "tracker" + j); //[4]
    loader.setAttribute("id", "loader" + j);

    var invalidErrorMsg = document.getElementById("invalidErrorMsg");
    invalidErrorMsg.setAttribute("class", "tracker" + j); //[5]
    invalidErrorMsg.setAttribute("id", "invalidErrorMsg" + j);

    var unknownErrorMsg = document.getElementById("unknownErrorMsg");
    unknownErrorMsg.setAttribute("class", "tracker" + j); //[6]
    unknownErrorMsg.setAttribute("id", "unknownErrorMsg" + j);

    var networkErrorMsg = document.getElementById("networkErrorMsg");
    networkErrorMsg.setAttribute("class", "tracker" + j); //[7]
    networkErrorMsg.setAttribute("id", "networkErrorMsg" + j);

    var queueIDList = document.getElementById("queueIDList");
    queueIDList.setAttribute("id", "selectList" + j);
    queueIDList.setAttribute("class", "tracker" + j); //[8]

    var checkbox = document.getElementById("checkbox");
    checkbox.setAttribute("class", "tracker" + j); //[9]
    checkbox.setAttribute("id", "checkbox" + j);

    var secLoader = document.getElementById("secLoader");
    secLoader.setAttribute("class", "tracker" + j); //[10]
    secLoader.setAttribute("id", "secLoader" + j);

    var line_graph = document.getElementById("line_graph");
    line_graph.setAttribute("class", "tracker" + j); //[11]
    line_graph.setAttribute("id", "line_graph" + j);
}

function submitAction(id) {
    var className = document.getElementById(id).className;

    var form = document.getElementsByClassName(className)[1].id;
    var formInput = document.getElementsByClassName(className)[2].id;

    var companyIDForm = document.getElementById(form);
    var company_id = document.getElementById(formInput).value;

    var queueIDList = document.getElementsByClassName(className)[8].id;
    var queueIDListLength = document.getElementById(queueIDList).length;

    var loader = document.getElementsByClassName(className)[4].id;
    var loaderID = document.getElementById(loader);

    var invalid = document.getElementsByClassName(className)[5].id;
    var invalidID = document.getElementById(invalid);

    var unknown = document.getElementsByClassName(className)[6].id;
    var unknownID = document.getElementById(unknown);

    var network = document.getElementsByClassName(className)[7].id;
    var networkID = document.getElementById(network);

    var graph = document.getElementsByClassName(className)[11].id;
    var lineGraph = document.getElementById(graph);

    clearInterval(interval);
    loaderID.style.display = "block";
    lineGraph.style.display = "none";
    

    var queueIDList = document.getElementsByClassName(className)[8].id;
    var queueIDListId = document.getElementById(queueIDList);

    // to reset previous queue_id searched
    while (queueIDListId.childElementCount != 1) {
        queueIDListId.removeChild(queueIDListId.lastElementChild);
    }
    axios.get(`https://ades-2b02.herokuapp.com/company/queue/`, {
        params: { company_id }
    }).then(function (res) {
        invalidID.style.display = "none";
        unknownID.style.display = "none";
        loaderID.style.display = "none";
        networkID.style.display = "none";
        

        var queueID = res.data;

        if (queueID.length == 0) {
            unknownID.style.display = "block";
        } else if (queueID.length >= 1) {

            queueIDListId.selectedIndex = 0;

            for (let i = 0; i < queueID.length; i++) {
                var option = document.createElement('OPTION');
                option.setAttribute("id", queueIDList + " option " + i);
                var txt = document.createTextNode(queueID[i].queue_id);

                // set grey color for inactive queue id
                if (queueID[i].is_active == 0) {
                    option.style.color = "rgb(211, 211, 211)";
                }

                option.value = queueID[i].queue_id;
                option.appendChild(txt);
                queueIDListId.insertBefore(option, queueIDListId.lastChild);
            }

            var checkbox = document.getElementsByClassName(className)[9].id;

            checkState(checkbox);
        }

    }).catch(function (error) {

        if (error.message == 'Request failed with status code 400') {
            invalidID.style.display = "block";
            unknownID.style.display = "none";
            loaderID.style.display = "none";
            networkID.style.display = "none";
        } else if (error.message == 'Network Error') {
            networkID.style.display = "block";
            invalidID.style.display = "none";
            unknownID.style.display = "none";
        }
    });

};

function checkState(id) {
    var checkbox = document.getElementById(id);
    var className = document.getElementById(id).className;

    var queueIDList = document.getElementsByClassName(className)[8].id;
    var queueIDListLength = document.getElementById(queueIDList).length - 1;

    for (var i = 0; i < queueIDListLength; i++) {
        var options = document.getElementById(queueIDList + " option " + i);

        if (options.style.color == "rgb(211, 211, 211)") {
            options.style.display = (checkbox.checked ? "none" : "block");
        }
    }
}

function fnRemove(id) {
    var child = document.getElementById(id);
    child.parentNode.removeChild(child);
}

