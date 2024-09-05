import React, { useState, useEffect } from 'react';
import { getVehicles, deleteVehicle } from '../api';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TablePagination, Typography } from '@mui/material';
import Loading from './Loading';

const VehicleList = ({ onEdit }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchVehicles();
  }, [page, rowsPerPage]);

  const fetchVehicles = async () => {
    try {
      const { data } = await getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Erro ao buscar veículos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVehicle(vehicleToDelete.id);
      setOpenDialog(false);
      fetchVehicles();
    } catch (error) {
      console.error("Erro ao deletar veículo", error);
    }
  };

  const handleOpenDialog = (vehicle) => {
    setVehicleToDelete(vehicle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setVehicleToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Data de Cadastro</TableCell>
                  <TableCell>Proprietário</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Cor</TableCell>
                  <TableCell>Valor Recebido</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{formatDate(vehicle.dataCadastro)}</TableCell>
                    <TableCell>{vehicle.owner}</TableCell>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.document}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell>R$ {vehicle.valorRecebido.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>
                      <Button onClick={() => onEdit(vehicle)} color="primary">Editar</Button>
                      <Button onClick={() => handleOpenDialog(vehicle)} color="secondary">Excluir</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={vehicles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza de que deseja excluir este veículo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleDelete} color="secondary">Excluir</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VehicleList;
