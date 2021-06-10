const echarts = require("echarts");
const Canvas = require("canvas-prebuilt");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");

const option = {
  tooltip: {
    trigger: "item"
  },
  legend: {
    top: "5%",
    left: "center"
  },
  series: [
    {
      name: "Pie Chart",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "40",
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: "A" },
        { value: 735, name: "B" },
        { value: 580, name: "C" },
        { value: 484, name: "D" },
        { value: 300, name: "E" }
      ]
    }
  ]
};

const getChartSVG = (option) => {
  echarts.setCanvasCreator(() => {
    return Canvas.createCanvas(100, 100);
  });

  const { window } = new JSDOM();
  global.window = window;
  global.navigator = window.navigator;
  global.document = window.document;

  const root = document.createElement("div");
  root.style.cssText = "width: 500px; height: 500px;";

  const chart = echarts.init(root, null, {
    renderer: "svg"
  });

  chart.setOption(option);

  const chartSvg = root.querySelector("svg").outerHTML;
  chart.dispose();

  return chartSvg;
};

const makePDF = (svg) => {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream("file.pdf");

  SVGtoPDF(doc, svg, 0, 0);

  stream.on("finish", function() {
    console.log("Done");
  });

  doc.pipe(stream);
  doc.end();
};

const run = () => {
  const svg = getChartSVG(option);
  makePDF(svg);
};

run();
