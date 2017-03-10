var int = 0;
function next_colour() {
  if (int == 0) {
    int += 1;
    return "#20B2AA"
  } else {
    return "#89FEEA"
  }
}

function format_question(question_arr, phrase) {
  var formatted_question_data = {
      type: "bar",
      showInLegend: true,
      lineThickness: 2,
      name: phrase,
      markerType: "square",
      color: next_colour(),
      dataPoints: []
  };

  for (var i=0; i<question_arr.length; i++) {
    var question = question_arr[i];

    console.log(question);
    formatted_question_data.dataPoints.push({
      x: new Date(question["timestamp"]),
      y: parseInt(question["frequency"])
    });
  }

  console.log(formatted_question_data);

  return formatted_question_data;
}

function format_individual_data(individual_data) {
  var formatted_individual_data = [];

  for (var k in individual_data) {
    console.log(k);
    console.log(individual_data[k]);
    formatted_individual_data.push(format_question(individual_data[k], k));
  }

  return formatted_individual_data;
}

function render_chart(raw_data) {
  var phrases = {};
  for (var k in raw_data) {
    var str = k.split(" ");
    var date = "March " + str[0] + " 2017";
    str.shift();
    var phrase = str.join(" ");
    var freq = raw_data[k];

    if (!phrases[phrase]) {
      phrases[phrase] = [];
    }

    phrases[phrase].push({ timestamp: date, frequency: freq });
  }

  console.log("phrases ", phrases);
  var data = format_individual_data(phrases);

  var chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Question Repetitions",
      fontSize: 30
    },
    animationEnabled: true,
    axisX: {
      gridColor: "Silver",
      tickColor: "silver",
      valueFormatString: "DD/MMM"
    },
    toolTip: {
      shared: true
    },
    theme: "theme2",
    axisY: {
      gridColor: "Silver",
      tickColor: "silver"
    },
    legend: {
      verticalAlign: "center",
      horizontalAlign: "right"
    },
    data: data,
    legend: {
      cursor: "pointer",
      itemclick: function (e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        }
        else {
          e.dataSeries.visible = true;
        }
        chart.render();
      }
    }
  });

  chart.render();
}
