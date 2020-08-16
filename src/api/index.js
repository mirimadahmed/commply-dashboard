import axios from 'axios'

const axiosObj = axios.create({
    baseURL: 'http://localhost/commply-api',
    headers: {
        'Cache-Control': 'no-cache'
    }
})


export default {
    adminLogin(admin) {
        let form = new FormData();
        form.append('type', "admin");
        form.append('email', admin.email);
        form.append('password', admin.password);
        return axiosObj.post(`/auth/login.php`, form)
    },
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
    updateOwner(owner) {
        let form = new FormData();
        form.append('id', owner.owner_id);
        form.append('firstname', owner.owner_firstname);
        form.append('lastname', owner.owner_lastname);
        form.append('email', owner.owner_email);
        form.append('password', owner.owner_password);
        form.append('company', owner.company_id);
        return axiosObj.post(`/company/owner/update.php`, form)
    },
    deleteOwner(owner) {
        let form = new FormData();
        form.append('id', owner.owner_id);
        return axiosObj.post(`/company/owner/delete.php`, form)
    },
    addOwner(owner) {
        let form = new FormData();
        form.append('id', owner.owner_id);
        form.append('firstname', owner.owner_firstname);
        form.append('lastname', owner.owner_lastname);
        form.append('email', owner.owner_email);
        form.append('password', owner.owner_password);
        form.append('company', owner.company_id);
        return axiosObj.post(`/company/owner/add.php`, form)
    },
    risks() {
        let url = `/company/risks.php`
        return axiosObj.get(url)
    }
}