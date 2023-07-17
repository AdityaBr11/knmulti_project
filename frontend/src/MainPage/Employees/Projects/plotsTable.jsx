import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Backdrop, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Add, Edit } from '@material-ui/icons';
import EditPlot from './EditPlot';
import AddOtherPlotDetails from './AddOtherPlotDetails';

function Row(props) {
  const { row, setLeadsInfoModal, setPlotInfoModal, setSelectedPlot, setCustomersInfoModal } =
    props;

  return (
    <React.Fragment>
      <TableRow sx={{}}>
        <TableCell scope="row">
          <Chip sx={{ cursor: 'pointer', }} 
            onClick={() => { setSelectedPlot(row); setPlotInfoModal(true); }}
            label={row?.name} />
          </TableCell>
        <TableCell align="right">{row?.dimension}</TableCell>
        <TableCell align="right">{row?.area}</TableCell>
        <TableCell align="right">{row?.areaCost || row?.cost}</TableCell>
        <TableCell align="right">{row?.corner || 0}</TableCell>
        <TableCell align="right">{row?.other  || 0}</TableCell>
        <TableCell align="right">{row?.cost}</TableCell>
        <TableCell align="right">{row?.facing}</TableCell>
        <TableCell align="right">{row?.description}</TableCell>
        <TableCell align="right">
          <Chip
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedPlot(row);
              setLeadsInfoModal(true);
            }}
            color="primary"
            label={
              row?.leadsInfo?.length +
              ' Lead' +
              (row?.leadsInfo.length !== 1 ? 's' : '  ')
            }
          />
        </TableCell>
        <TableCell align="right"> 
            { row?.soldTo ? 
              <Link to={`/app/profile/customer-profile/${row?.soldTo?._id}`}>
                
                <Chip sx={{ cursor: 'pointer', }}
                  color="primary"
                  label={
                    `${row?.soldTo?.displayName}`
                  }
                />
              </Link>
            :
            <Chip
              color="primary"
              label={
               "No Customer"
              }
            />
            }
        </TableCell>
        <TableCell align="right">
          {row?.sold ? (
            <Chip color="success" label={'Sold'} />
          ) : (
            <Chip color="warning" label={'Avaiable'} />
          )}
        </TableCell>
      </TableRow>
      {/* <EditPlot plot={row} /> */}
    </React.Fragment>
  );
}

export default function PlotsTable({ setRerender, plots }) {
  const [leadsInfoModal, setLeadsInfoModal] = React.useState(false);
  const [plotInfoModal, setPlotInfoModal] = React.useState(false);
  const [selectedPlot, setSelectedPlot] = React.useState(null);
  const [customersInfoModal, setCustomersInfoModal] = React.useState(false);

  return (
    <>
    <div style={{ width: "100vw" }} className="text-right mb-2">
      <a
        href="#"
        className="btn btn-primary mr-2"
        data-toggle="modal"
        data-target="#edit_plot"
      >
        <Edit /> Adjust Cost
      </a>
      <a
        href="#"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#add_otherdetails_plot"
      >
        <Add /> Add Revenue Plot
      </a>
    </div>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Dimensions</TableCell>
              <TableCell align="right">Area</TableCell>
              <TableCell align="right">Area Cost</TableCell>
              <TableCell align="right">Corner Cost</TableCell>
              <TableCell align="right">Other Cost</TableCell>
              <TableCell align="right">Grand Total</TableCell>
              <TableCell align="right">Facing</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">
                Leads&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </TableCell>
              <TableCell align="right">
                Customer&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </TableCell>
              <TableCell align="right">
                Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plots?.map((plot) => (
              <Row
                key={plot?.name}
                row={plot}
                setLeadsInfoModal={setLeadsInfoModal}
                setPlotInfoModal={setPlotInfoModal}
                setSelectedPlot={setSelectedPlot}
                setCustomersInfoModal={setCustomersInfoModal}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Backdrop sx={{ zIndex: '99999999', }}
        open={plotInfoModal && selectedPlot}
        onClick={() => { setPlotInfoModal(false); setSelectedPlot(null); }} >
          {selectedPlot && (
            <div onClick={(e) => { e.stopPropagation(); }}
              style={{ width: '60%', height: '60%', backgroundColor: '#fff', padding: '2rem', }} >
              <h4 style={{ textAlign: 'center', fontWeight: 700, margin: '1rem', }} >
                {selectedPlot?.name}
              </h4>
              <div className='d-flex justify-content-center'>
                <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                  Dimension : {selectedPlot?.dimension}
                </h4>
                <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                  Area : {selectedPlot?.area}
                </h4>
                <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                  Cost : {selectedPlot?.cost}
                </h4>
              </div>
              <hr />
              <TableContainer component={Paper}>
                <Table aria-label="table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Area</TableCell>
                      <TableCell align="right">Percentage(%)</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPlot?.revenuePlot?.map((rp) => (
                      <TableRow key={rp?._id}>
                        <TableCell>{rp?.name}</TableCell>
                        <TableCell align="right">{rp?.area}</TableCell>
                        <TableCell align="right">{rp?.percent}%</TableCell>
                        <TableCell align="right">{rp?.cost}</TableCell>
                        <TableCell align="right">{rp?.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                {selectedPlot?.revenuePlot?.length == 0 && (
                  <div style={{ height: '25vh', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', }} >
                    <h4>No Revenue Plot</h4>
                  </div>
                )}
              </TableContainer>
              </div>
              ) 
          }
      </Backdrop>

      <Backdrop sx={{ zIndex: '99999999', }}
        open={leadsInfoModal && selectedPlot}
        onClick={() => { setLeadsInfoModal(false); setSelectedPlot(null); }} >
        {selectedPlot && (
          <div onClick={(e) => { e.stopPropagation(); }}
            style={{ width: '60%', height: '60%', backgroundColor: '#fff', padding: '2rem', }} >
            <h4 style={{ textAlign: 'center', fontWeight: 700, margin: '1rem', }} >
              {selectedPlot?.name}
            </h4>
            <div className='d-flex justify-content-center'>
              <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                Dimension : {selectedPlot?.dimension}
              </h4>
              <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                Area : {selectedPlot?.area}
              </h4>
              <h4 style={{ textAlign: 'center', fontWeight: 500, margin: '1rem', }} >
                Cost : {selectedPlot?.cost}
              </h4>
            </div>
            <hr />
            <TableContainer component={Paper}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Plot</TableCell>
                    <TableCell align="right">Phone</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">isCustomer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPlot.leadsInfo.map((l) => (
                    <TableRow key={l?._id}>
                      <TableCell>{l?.customer?.displayName || l?.lead?.name}</TableCell>
                      <TableCell align="right">{selectedPlot?.name}</TableCell>
                      <TableCell align="right">{l?.customer?.phone || l?.lead?.phone}</TableCell>
                      <TableCell align="right">{l?.leadType}</TableCell>
                      <TableCell align="right">{l?.isCustomer ? "YES" : "NO"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {selectedPlot?.leadsInfo?.length === 0 && (
                <div style={{ height: '35vh', display: 'flex', 
                  justifyContent: 'center', alignItems: 'center', }} >
                  <h4>No Leads</h4>
                </div>
              )}
            </TableContainer>
          </div>
        )}
      </Backdrop>

      {/* <Backdrop sx={{ zIndex: '99999999', }}
        open={customersInfoModal && selectedPlot}
        onClick={() => { setCustomersInfoModal(false); setSelectedPlot(null); }} >
        {selectedPlot && (
          <div onClick={(e) => { e.stopPropagation(); }}
            style={{ width: '60%', height: '60%', backgroundColor: '#fff', padding: '2rem', }} >
            <h4 style={{ textAlign: 'center', fontWeight: 700, margin: '1rem', }} >
              Leads for Plot {selectedPlot?.name}
            </h4>
            <hr />
            <TableContainer component={Paper}>
              <Table aria-label="table">
                <TableHead>
                  <TableRow>
                    <TableCell>Lead Name</TableCell>
                    <TableCell align="right">Plot</TableCell>
                    <TableCell align="right">Lead Phone</TableCell>
                    <TableCell align="right">Lead Status</TableCell>
                    <TableCell align="right">Manager By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPlot.leadsInfo.map((l) => (
                    <TableRow key={l?._id}>
                      <TableCell>{l?.lead?.name}</TableCell>
                      <TableCell align="right">{selectedPlot?.name}</TableCell>
                      <TableCell align="right">{l?.lead?.phone}</TableCell>
                      <TableCell align="right">{l?.leadType}</TableCell>
                      <TableCell align="right">{l?.lead?.assignedTo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {selectedPlot?.leadsInfo?.length === 0 && (
                <div style={{ height: '35vh', display: 'flex', 
                  justifyContent: 'center', alignItems: 'center', }} >
                  <h4>No Leads</h4>
                </div>
              )}
            </TableContainer>
          </div>
        )}
      </Backdrop> */}
      <EditPlot setRerender={setRerender} plots={plots} />
      <AddOtherPlotDetails setRerender={setRerender} plots={plots} />
    </>
  );
}
