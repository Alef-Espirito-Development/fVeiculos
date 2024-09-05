// src/App.js
import React, { useState, useEffect } from 'react';
import VehicleList from './components/VehicleList';
import VehicleForm from './components/VehicleForm';
import Message from './components/Mensagens';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const App = () => {
  const [vehicles, setVehicles] = useState([]); // Estado para armazenar a lista de veículos
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openMessage, setOpenMessage] = useState(false);
  const [startDate, setStartDate] = useState(''); // Data de início para o filtro
  const [endDate, setEndDate] = useState(''); // Data de término para o filtro

  // Função para buscar veículos do backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles'); // Substitua pelo seu endpoint correto
        const data = await response.json();
        setVehicles(data); // Atualiza o estado com a lista de veículos
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      }
    };

    fetchVehicles();
  }, []); // Executa apenas uma vez após o componente ser montado

  const handleEdit = (vehicle) => {
    setCurrentVehicle(vehicle);
    setOpen(true);
  };

  const handleAdd = () => {
    setCurrentVehicle(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentVehicle(null);
  };

  const handleSuccess = (msg) => {
    setMessage(msg);
    setMessageType('success');
    setOpenMessage(true);
    handleClose();
  };

  const handleError = (msg) => {
    setMessage(msg);
    setMessageType('error');
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();

    // Adiciona título
    doc.text("Relatório de Veículos", 14, 22);
    doc.setFontSize(12);
    doc.text(`Data Início: ${startDate || 'Não especificada'}`, 14, 32);
    doc.text(`Data Fim: ${endDate || 'Não especificada'}`, 14, 42);

    // Filtro de veículos pela data
    const filteredVehicles = vehicles.filter((vehicle) => {
      if (startDate && endDate) {
        const vehicleDate = new Date(vehicle.dataCadastro);
        return vehicleDate >= new Date(startDate) && vehicleDate <= new Date(endDate);
      }
      return true;
    });

    // Calcula o valor total recebido
    const totalReceived = filteredVehicles.reduce((sum, vehicle) => sum + vehicle.valorRecebido, 0);

    // Gera a tabela do relatório
    doc.autoTable({
      head: [['Proprietário', 'Placa', 'Documento', 'Cor', 'Valor Recebido', 'Data de Cadastro']],
      body: filteredVehicles.map((vehicle) => [
        vehicle.owner,
        vehicle.licensePlate,
        vehicle.document,
        vehicle.color,
        `R$ ${vehicle.valorRecebido.toFixed(2).replace('.', ',')}`,
        new Date(vehicle.dataCadastro).toLocaleDateString('pt-BR'),
      ]),
      startY: 50,
    });

    // Adiciona o valor total no rodapé
    doc.text(`Valor Total: R$ ${totalReceived.toFixed(2).replace('.', ',')}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save('Relatorio_Veiculos.pdf');
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Cadastro de Veículos Danusa
      </Typography>

      {/* Filtros de Data */}
      <TextField
        label="Data Início"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        style={{ marginRight: '16px' }}
      />
      <TextField
        label="Data Fim"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        style={{ marginRight: '16px' }}
      />

      {/* Botão para gerar relatório */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGenerateReport}
        style={{ marginBottom: '16px' }}
      >
        Gerar Relatório PDF
      </Button>

      {/* Botão para adicionar um novo veículo */}
      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginBottom: '16px' }}>
        Adicionar Veículo
      </Button>

      {/* Lista de Veículos */}
      <VehicleList onEdit={handleEdit} vehicles={vehicles} />

      {/* Modal para Formulário de Veículo */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentVehicle ? 'Editar Veículo' : 'Adicionar Veículo'}</DialogTitle>
        <DialogContent>
          <VehicleForm currentVehicle={currentVehicle} onSuccess={handleSuccess} onError={handleError} />
        </DialogContent>
      </Dialog>

      {/* Mensagens de Sucesso/Erro */}
      <Message open={openMessage} handleClose={handleCloseMessage} message={message} type={messageType} />
    </Container>
  );
};

export default App;
