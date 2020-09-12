import React from 'react'
import MaterialTable from 'material-table';
import { green } from '@material-ui/core/colors';

function AdminPageTable({ data,setData,name,columns }) {
    return (
        <MaterialTable
            title={name}
            data={data}
            columns={columns}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        setData([...data, newData]);
                        resolve();
                    }, 1000);
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    resolve();
                }, 1000);
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                    resolve();
                }, 1000);
            })
        }}
        options={{
            paging:false,
            exportButton: true,
            maxBodyHeight:500,
            actionsColumnIndex:-1,
            headerStyle:{
                backgroundColor:'rgb(67, 176, 42)',
                color:'white',
                paddingTop:'10px',
                paddingBottom:'10px',
            }
        }}
    />
    )
}

export default AdminPageTable
