import axios from 'axios'

const axiosObj = axios.create({
    baseURL: 'http://localhost/commply-api/',
    headers: {
        'Cache-Control': 'no-cache'
      }
})


export default {
    companies(id) {
        let url = `/company/get.php`
        if (id) {
            url += `?id=${id}`
        }
        return axiosObj.get(url)
    },
    updateCompany(company) {
        let form = new FormData();
        form.append('id', company.company_id);
        form.append('name', company.company_name);
        form.append('address', company.company_address);
        form.append('vat', company.company_vat);
        form.append('email', company.company_email);
        return axiosObj.post(`/company/update.php`, form)
    },
    employees(id) {
        let url = `/company/employee/get.php`
        if (id) {
            url += `?id=${id}`
        }
        return axiosObj.get(url)
    },
    owners() {
        let url = `/company/owner/get.php`
        return axiosObj.get(url)
    },
    risks() {
        let url = `/company/risks.php`
        return axiosObj.get(url)
    },
    users(page) {
        return axiosObj.get(`/get_users.php?page=${page}`)
    },
    activate(id) {
        let form = new FormData();
        form.append('id', id);
        form.append('status', 'active');
        return axiosObj.post(`/update_userstatus.php`, form)
    },
    suspend(id) {
        let form = new FormData();
        form.append('id', id);
        form.append('status', 'suspended');
        return axiosObj.post(`/update_userstatus.php`, form)
    },
    listings(page) {
        return axiosObj.get(`/get_listings.php?page=${page}&type=tour`)
    },
    experiences(page) {
        return axiosObj.get(`/get_listings.php?page=${page}&type=experience`)
    },
    activateListing(id) {
        let form = new FormData();
        form.append('id', id);
        form.append('status', 'active');
        return axiosObj.post(`/update_listingstatus.php`, form)
    },
    suspendListing(id) {
        let form = new FormData();
        form.append('id', id);
        form.append('status', 'suspended');
        return axiosObj.post(`/update_listingstatus.php`, form)
    },
    reportedUsers(page) {
        return axiosObj.get(`/get_reporteditems.php?page=${page}&type=users`)
    },
    reportedListings(page) {
        return axiosObj.get(`/get_reporteditems.php?page=${page}&type=listings`)
    }
}