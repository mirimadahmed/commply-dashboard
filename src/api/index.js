import axios from 'axios'
import moment from 'moment'

const axiosObj = axios.create({
    baseURL: '.',
    headers: {
        'Cache-Control': 'no-cache'
    }
})


export default {
    login(setting) {
        let form = new FormData();
        form.append('type', setting.type);
        form.append('email', setting.email);
        form.append('password', setting.password);
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
    updateEmployee(employee) {
        let form = new FormData();
        form.append('id', employee.employee_id);
        form.append('newid', employee.employee_id_number);
        form.append('firstname', employee.employee_firstname);
        form.append('middlename', employee.employee_middlename);
        form.append('lastname', employee.employee_lastname);
        form.append('job', employee.employee_job);
        form.append('number', employee.employee_number);
        form.append('tel', employee.employee_telephone);
        form.append('company', employee.company_id);
        form.append('manager', employee.manager_id);
        return axiosObj.post(`/company/employee/update.php`, form)
    },
    allEmployees(id) {
        let url = `/company/employee/all.php`
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
    risks(id) {
        let url = `/company/risks.php`
        if (id) {
            url += `?id=${id}`
        }
        return axiosObj.get(url)
    },
    updateRisk(risk) {
        let form = new FormData();
        form.append('id', risk.risk_id);
        form.append('status', risk.status);
        return axiosObj.post(`/company/update_risk.php`, form)
    },
    print_reports(report) {
        let form = new FormData();
        form.append('table_name', report.table_name);
        form.append('start', moment(report.start).format('YYYY-MM-DD'));
        form.append('end', moment(report.end).format('YYYY-MM-DD'));
        form.append('is_owner', report.is_owner);
        form.append('company_id', report.company_id);
        return axiosObj.post(`/print_report.php`, form)
    },
    buildings(id) {
        let url = `/company/buildings.php`
        if (id) {
            url += `?id=${id}`
        }
        return axiosObj.get(url)
    },
    print_declarations(report) {
        let form = new FormData();
        form.append('employee_number', report.employee_number);
        form.append('is_owner', report.is_owner);
        form.append('company_id', report.company_id);
        return axiosObj.post(`/company/employee/declaration.php`, form)
    },
    print_walkthroughs(report) {
        let form = new FormData();
        form.append('buliding', report.buliding);
        form.append('date', moment(report.date).format('YYYY-MM-DD'));
        form.append('is_owner', report.is_owner);
        form.append('company_id', report.company_id);
        return axiosObj.post(`/company/print_walkthrough.php`, form)
    },
    print_risk_report(report) {
        let form = new FormData();
        form.append('risk_id', report.risk_id);
        form.append('is_owner', report.is_owner);
        form.append('company_id', report.company_id);
        return axiosObj.post(`/company/print_risk_report.php`, form)
    },
    walkthroughs(setting) {
        return axiosObj.get(`/company/walkthroughs.php?is_owner=${setting.is_owner}&company_id=${setting.company_id}`)
    },
    subsidaries(setting) {
        return axiosObj.get(`/company/owner/subsidaries.php?is_owner=${setting.is_owner}&company_id=${setting.company_id}`);
    },
    employee_stats(setting) {
        return axiosObj.get(`/company/employee/stats.php?is_owner=${setting.is_owner}&company_id=${setting.company_id}&subsidary=${setting.company}&daterange_report=${setting.isDateRange}&start=${moment(setting.start).format('YYYY-MM-DD')}&end=${moment(setting.end).format('YYYY-MM-DD')}&report=${setting.reportType}`)
    },
    visitor_stats(setting) {
        return axiosObj.get(`/company/visitor_stats.php?is_owner=${setting.is_owner}&company_id=${setting.company_id}&daterange_report=${setting.isDateRange}&start=${moment(setting.start).format('YYYY-MM-DD')}&end=${moment(setting.end).format('YYYY-MM-DD')}&report=${setting.reportType}`)
    },
    risk_stats(setting) {
        return axiosObj.get(`/company/risk_stats.php?is_owner=${setting.is_owner}&company_id=${setting.company_id}&daterange_report=${setting.isDateRange}&start=${moment(setting.start).format('YYYY-MM-DD')}&end=${moment(setting.end).format('YYYY-MM-DD')}&report=${setting.reportType}`)
    },
    homestats(setting) {
        return axiosObj.get(`/home_stats.php?is_owner=${setting.is_owner}&company_id=${setting.company_id}`)
    },
    contact_tracing(setting) {
        let form = new FormData();
        form.append('employee_number', setting.employee_number);
        form.append('date', moment(setting.date).format('YYYY-MM-DDTHH:mm:ss'));
        return axiosObj.post(`/company/employee/tracing.php`, form)
    }
}