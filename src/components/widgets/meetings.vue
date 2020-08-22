<script>
export default {
  props: {
    meetings: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    getMeeters(meeting) {
      return meeting.meeters.join(", ");
    },
  },
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "name",
      sortDesc: false,
      fields: [
        { key: "date_created", sortable: true },
        { key: "with", sortable: false },
      ],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.meetings.length;
    },
  }
};
</script>

<template>
  <div>
    <div v-if="meetings.length > 0">
      <div class="table-responsive mb-0">
        <b-table
          striped
          hover
          :items="meetings"
          :fields="fields"
          responsive="sm"
          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template v-slot:cell(with)="row">
            {{getMeeters(row.item)}}
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
</template>