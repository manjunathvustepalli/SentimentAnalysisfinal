import React from 'react'
import MaterialTable from 'material-table';

function AdminTable({ data,name,columns,setNewlyAddedWord,setDeletedWord,loaderOpen }) {
    return (
        <MaterialTable
            style={{
                padding:'20px',
                margin:'20px'
            }}
            isLoading={loaderOpen}
            title={name}
            data={data}
            columns={columns}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    setNewlyAddedWord(newData.name)
                    resolve();
                }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    // setDeletedWord(dataDelete)
                    setDeletedWord(oldData.name)
                    resolve();
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

export default AdminTable
