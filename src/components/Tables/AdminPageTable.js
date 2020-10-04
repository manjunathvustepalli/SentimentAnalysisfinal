import React from 'react'
import MaterialTable from 'material-table';

function AdminPageTable({ data,setData,name,columns,objName }) {
    return (
        <MaterialTable
            style={{
                padding:'20px',
                margin:'20px'
            }}
            title={name}
            data={data}
            columns={columns}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    setData(prev =>{
                        return {...prev,[objName]:[...data, newData]}
                    });
                    resolve();
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                    setData(prev =>{
                        return {...prev,[objName]:[...dataUpdate]}
                    });
                    resolve();
                    }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData(prev =>{
                        return {...prev,[objName]:[...dataDelete]}
                    });
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
