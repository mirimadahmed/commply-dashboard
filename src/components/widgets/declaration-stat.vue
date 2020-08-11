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
          offsetY: -10
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
              name: {
                fontSize: "13px",
                color: undefined,
                offsetY: 60
              },
              value: {
                offsetY: 22,
                fontSize: "16px",
                color: undefined,
                formatter: function(val) {
                  return val + "%";
                }
              }
            }
          }
        },
        colors: ["#008000"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
          }
        },
        stroke: {
          dashArray: 4
        },
        labels: ["YES"]
      }
    };
  }
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title mb-4">Declaration Percentage</h4>
      <div class="row">
        <div class="col-sm-12">
          <!-- Chart -->
          <apexchart
            class="apex-charts"
            type="radialBar"
            height="250"
            dir="ltr"
            :series="series"
            :options="chartOptions"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>