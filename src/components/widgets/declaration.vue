<script>
export default {
  props: {
    series: {
      required: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          stacked: true,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: true
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "30%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [
            "Q1",
            "Q2",
            "Q3",
            "Q4",
            "Q5",
            "Q6",
            "Q7",
            "Q8",
            "Q9",
            "Q10",
            "Q11",
            "Q12",
            "Q13",
            "Q14",
            "Q15",
            "Q16",
            "Q17",
            "Q18",
            "Q19"
          ]
        },
        colors: ["#008000", "#FF0000"],
        legend: {
          position: "bottom"
        },
        fill: {
          opacity: 1
        }
      }
    };
  }
};
</script>
<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title mb-4">Declaration</h4>

      <apexchart
        class="apex-charts"
        type="bar"
        dir="ltr"
        height="362"
        :series="series"
        :options="chartOptions"
      ></apexchart>
    </div>
  </div>
</template>