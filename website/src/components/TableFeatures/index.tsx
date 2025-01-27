import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './styles.module.css';
import data from "../../data/outputs.json";

export default function TableFeatures(): JSX.Element {
    const [customers, setcustomers] = useState(null);
    const [filters, setfilters] = useState(null);
    const [globalFilterValue, setglobalFilterValue] = useState('');
    const [loading, setloading] = useState(true);

    useEffect(() => {
        setcustomers(getCustomers(data)); 
        setloading(false);
        initfilters();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const getCustomers = (data) => {
        return [...data.data || []].map(d => {
            d.date = new Date(d.date);
            return d;
        });
    }

    const clearFilter = () => {
        initfilters();
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setfilters(_filters);
        setglobalFilterValue(value);
    }

    const initfilters = () => {
        setfilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'type': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'license': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'tags': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
        });
        setglobalFilterValue('');
    }

    const renderheader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" className="p-button-outlined" onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return <React.Fragment>
            <a href={rowData.site_url}>{rowData.name}</a>
        </React.Fragment>
    }
    const repositoryPlatformBodyTemplate = (rowData) => {
        return <React.Fragment>
            <a href={rowData.repository_url}>{rowData.repository_platform}</a>
        </React.Fragment>
    }

    const tagsBodyTemplate = (rowData) => {
        return rowData.tags.join(", ")
    }

    const header = renderheader();

    return (
        <div className="datatable-filter-demo">
            <div className="card">
                <DataTable 
                    value={customers} 
                    paginator 
                    showGridlines 
                    className="p-datatable-customers" 
                    rows={20}
                    dataKey="id" 
                    filters={filters} 
                    filterDisplay="menu" 
                    loading={loading} 
                    responsiveLayout="scroll"
                    globalFilterFields={['name', 'repository_platform']} 
                    header={header} emptyMessage="No projects found.">
                    <Column field="name" header="Name"  body={nameBodyTemplate} filter filterPlaceholder="Search by name" style={{ minWidth: '20em' }} />
                    <Column field="repository_platform" body={repositoryPlatformBodyTemplate} header="Repository Platform" style={{ minWidth: '10em' }} />
                    <Column field="type" header="Type" filter filterPlaceholder="Search by type" style={{ minWidth: '10em' }} />
                    <Column field="license" header="License" filter filterPlaceholder="Search by license" style={{ minWidth: '20em' }} />
                    <Column field="tags" header="Tags" filter filterPlaceholder="Search by tags" style={{ minWidth: '55em' }} body={tagsBodyTemplate} />
                </DataTable>
            </div>
        </div>
    );
}