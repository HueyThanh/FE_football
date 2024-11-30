import React from 'react';
import {
  Card,
} from '@mui/material';
import MaterialTable from 'material-table';
import { DeleteOutline, Edit, SaveAlt, FilterList, FirstPage, LastPage, ChevronLeft, ChevronRight, Save } from '@material-ui/icons';

export const ManageCalendarTable = (props) => {
  const {
    columns,
    listItem
  } = props;

  return (
    <Card style={{ padding: 0 }}>
      <MaterialTable
        title={''}
        columns={columns}
        data={listItem}
        // localization={{
        //   body: {
        //     emptyDataSourceMessage: "Không có bán ghi nào.",
        //   },
        //   pagination: {
        //     labelDisplayedRows: "{from}-{to} trong {count}",
        //     firstTooltip: "Trang đầu",
        //     previousTooltip: "Trang trước",
        //     nextTooltip: "Trang tiếp",
        //     lastTooltip: "Trang cuối",
        //     labelRowsSelect: "hàng mỗi trang",
        //     labelRowsPerPage: ''
        //   } 
        // }}
        options={{
          // search: false,
          // padding: "dense",
          sorting: false,
          selection: false,
          toolbar: false,
          headerStyle: {
            backgroundColor: "#6366f1",
            color: "#fff",
          },
        }}
        icons={{
          FirstPage: FirstPage,
          LastPage: LastPage,
          PreviousPage: ChevronLeft,
          NextPage: ChevronRight,
        }}
      />
    </Card>
  );
};