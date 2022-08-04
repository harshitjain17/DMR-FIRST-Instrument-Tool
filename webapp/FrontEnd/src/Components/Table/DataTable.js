import React from 'react';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import "./DataTable.css";

import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import InstrumentPopop from '../InstrumentDetail/InstrumentPopup';
import { CustomNoRowsOverlay } from './Customizing';

const columns = [
  // ID (hidden)
  { field: 'id', type: 'number', hide: true },

  // INSTITUTION
  {
    field: 'institution', headerName: 'Institution', minWidth: 175, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // FACILITY
  {
    field: 'facility', headerName: 'Facility', minWidth: 100, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // INSTRUMENT TYPE
  {
    field: 'type', headerName: 'Instrument Type', minWidth: 140, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // INSTRUMENT NAME
  {
    field: 'name', headerName: 'Instrument Name', minWidth: 175, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // Manufacturer
  {
    field: 'manufacturer', headerName: 'Manufacturer', minWidth: 175, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // Model
  {
    field: 'model', headerName: 'Model', minWidth: 160, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // LOCATION ID (for filtering table through map)
  { field: 'location', headerName: 'Location ID', minWidth: 95, flex: 1 },

  // DISTANCE
  { field: 'distance', headerName: 'Distance', minWidth: 80, flex: 1 },

  // CITY
  {
    field: 'city', headerName: 'City', minWidth: 150, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // STATE
  { field: 'state', headerName: 'State', minWidth: 70, flex: 1 },

  // AWARD
  {
    field: 'award', headerName: 'Award', minWidth: 150, flex: 1,
    renderCell: (params) => (
      <Tooltip title={params.value.toString()} >
        <span className="table-cell-trucate">{params.value.toString()}</span>
      </Tooltip>)
  },

  // STATUS
  { field: 'status', headerName: 'Status', minWidth: 90, flex: 1 },
];


export default function DataTable(
  { response, selectedLocation, loading, minimumTimeElapsed }
) {
  const [doi, setDoi] = React.useState('');
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
        instrumentId: instrument.instrumentId,
        manufacturer: instrument.manufacturer,
        model: instrument.model
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
    setDoi(params.row.doi || params.row.instrumentId);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false)
  };

  // breakpoints for responsiveness
  const xlargeScreen = useMediaQuery('(min-width:2560px)');

  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* if loading, render LinearProgress state */}
      {!minimumTimeElapsed || loading ? (
        <DataGrid
          rows={[]}
          columns={columns}
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
          pageSize={xlargeScreen ? 15 : 5}
          rowsPerPageOptions={xlargeScreen ? [15] : [5]}
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
      <InstrumentPopop isOpen={isOpen} handleClose={handleCloseModal} doi={doi} />
    </div>
  );
};