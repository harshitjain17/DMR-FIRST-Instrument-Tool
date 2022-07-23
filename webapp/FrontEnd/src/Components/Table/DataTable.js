import React from 'react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import "./DataTable.css";

import LinearProgress from '@mui/material/LinearProgress';
import InstrumentPopop from '../InstrumentDetail/InstrumentPopup';
import { CustomNoRowsOverlay } from './Customizing';

const columns = [
  { field: 'id', headerName: 'ID', type: 'number', width: 0 },
  { field: 'institution', headerName: 'Institution', width: 175 },
  { field: 'facility', headerName: 'Facility', width: 175 },
  { field: 'type', headerName: 'Instrument Type', width: 140 },
  { field: 'name', headerName: 'Instrument Name', width: 175 },
  { field: 'doi', headerName: 'DOI', width: 160 },
  { field: 'location', headerName: 'Location ID', width: 95 },
  { field: 'distance', headerName: 'Distance', width: 80 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'state', headerName: 'State', width: 80 },
  { field: 'award', headerName: 'Award', width: 150 },
  { field: 'status', headerName: 'Status', width: 90 },
];


export default function DataTable(
  { response, selectedLocation, loading, minimumTimeElapsed }
  ) {
  const [instrumentId, setInstrumentId] = React.useState('');
  const [isOpen, setOpen] = React.useState(false);
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  const [visibilityModel, setVisibilityModel] = React.useState({ id: false, distance: false });

  var searchResult = response.instruments ?
    response.instruments.map(instrument => {
      return {
        id: instrument.label,
        distance: `${instrument.distance} mi`,
        institution: instrument.institution,
        facility: instrument.facility,
        location: instrument.location,
        type: instrument.type,
        name: instrument.name,
        doi: instrument.doi,
        city: instrument.city,
        state: instrument.state,
        award: instrument.award,
        status: instrument.status,
        instrumentId: instrument.instrumentId
      };
    }) : [];

  React.useEffect(() => {
    // When the selected location changes, set a filter on the location. 
    // The current (free) version of MUI only allows filtering by one column,
    // so any user set filter will be removed unfortunately.
    setFilterModel({
      items: selectedLocation ? [
        { id: 0, columnField: 'location', operatorValue: 'equals', value: selectedLocation }
      ] : []
    });
  }, [selectedLocation])

  React.useEffect(() => {
    // use the current visibility, and only modify the distance column.
    // We have to clone and return a new object, if not react sees the same object ref and assumes no change
    setVisibilityModel((currentVisibility) =>
      Object.assign({}, currentVisibility, { distance: !!response.searchLocation?.address })
    );
  }, [response.searchLocation])

  const handleOnRowClick = (params) => {
    setInstrumentId(params.row.instrumentId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false)
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* if loading, render LinearProgress state */}
      {!minimumTimeElapsed || loading ? (
        <DataGrid
          rows={[]}
          columns={columns}
          density="compact"
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: LinearProgress,
          }}
          componentsProps={{
            toolbar: { showQuickFilter: true },
          }}
          columnVisibilityModel={visibilityModel}
          onColumnVisibilityModelChange={(newModel) => setVisibilityModel(newModel)}
          checkboxSelection
          disableSelectionOnClick
        />

      ) : (
        <DataGrid
          rows={searchResult}
          columns={columns}
          density="compact"
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: CustomNoRowsOverlay
          }}
          componentsProps={{
            toolbar: { showQuickFilter: true },
          }}
          columnVisibilityModel={visibilityModel}
          onColumnVisibilityModelChange={(newModel) => setVisibilityModel(newModel)}
          filterModel={filterModel}
          onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleOnRowClick}
        />
      )}
      <InstrumentPopop isOpen={isOpen} handleClose={handleCloseModal} instrumentId={instrumentId} />
    </div>
  );
};