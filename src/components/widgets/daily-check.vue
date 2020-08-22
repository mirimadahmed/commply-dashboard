<script>
export default {
  props: {
    checks: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      showModal: false,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "name",
      sortDesc: false,
      fields: [
        { key: "date_added", sortable: true },
        { key: "location", sortable: true },
        { key: "symptoms", sortable: false },
      ],
      pillMap: {
        sore_throat: "Sore Throat",
        cough: "Cough",
        loss_of_smell: "Loss Of Smell",
        body_aches: "Body Aches",
        fever: "Fever",
        redness: "Redness",
        shortness_of_breath: "Shortness of Breath",
        nausea: "Nausea",
        vomiting: "Vomiting",
        diarrhea: "Diarrhea",
        weakness: "Weakness",
        contact_with: "Contact with infected",
      },
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.checks.length;
    },
  }
};
</script>

<template>
  <div>
    <div v-if="checks.length > 0">
      <div class="table-responsive mb-0">
        <b-table
          striped
          hover
          :items="checks"
          :fields="fields"
          responsive="sm"
          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template v-slot:cell(symptoms)="row">
            <span
              v-for="pill in Object.keys(pillMap)"
              :key="pill"
              class="badge badge-pill badge-success font-size-12 mr-1"
              :class=" { 'badge-danger': `${row.item[pill]}` === 'YES' }"
            >
              {{pillMap[pill]}}
              <i
                :class=" { 
                  'bx bx-sad': `${row.item[pill]}` === 'YES',
                  'bx bx-happy': `${row.item[pill]}` === 'NO'
                }"
              />
            </span>
          </template>
        </b-table>
      </div>

      <div class="row">
        <div class="col">
          <div class="dataTables_paginate paging_simple_numbers float-right">
            <ul class="pagination pagination-rounded mb-0">
              <!-- pagination -->
              <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text text-center">No data.</div>
  </div>
  <!-- end table -->
</template>