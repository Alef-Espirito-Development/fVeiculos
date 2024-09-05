import React, { useState, useEffect } from 'react';
import { createVehicle, updateVehicle } from '../api';
import { Button, TextField, Container, Grid, Typography, Paper, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { format as formatCurrency } from 'currency-formatter';

const colorOptions = [
  'Branco', 'Preto', 'Prata', 'Vermelho', 'Azul', 'Cinza', 'Verde', 'Amarelo', 'Marrom', 'Rosa'
];

const VehicleForm = ({ currentVehicle, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    proprietario: '',
    licensePlate: '',
    documento: '',
    cor: '',
    valorRecebido: ''
  });

  const [rawValue, setRawValue] = useState('');
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (currentVehicle) {
      setFormData({
        proprietario: currentVehicle.proprietario,
        licensePlate: currentVehicle.licensePlate,
        documento: currentVehicle.documento,
        cor: currentVehicle.cor,
        valorRecebido: formatCurrency(currentVehicle.valorRecebido, { code: 'BRL' })
      });
      setRawValue(currentVehicle.valorRecebido);
    }
  }, [currentVehicle]);

  const validate = () => {
    const errors = {};
    if (!formData.proprietario) errors.proprietario = 'O campo proprietário é obrigatório';
    if (!formData.licensePlate) errors.licensePlate = 'O campo placa é obrigatório';
    if (!formData.documento) errors.documento = 'O campo documento é obrigatório';
    if (!formData.cor) errors.cor = 'O campo cor é obrigatório';
    if (!formData.valorRecebido || isNaN(rawValue) || rawValue <= 0) errors.valorRecebido = 'O valor recebido deve ser um número positivo';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'valorRecebido') {
      const numericValue = value.replace(/[^\d]/g, '');
      setRawValue(numericValue);
      const formattedValue = formatCurrency(parseFloat(numericValue) / 100, { code: 'BRL' });
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setOpenDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const formattedValue = parseFloat(rawValue) / 100;
      const dataToSend = { ...formData, valorRecebido: formattedValue };

      if (currentVehicle) {
        await updateVehicle(currentVehicle.id, dataToSend);
        onSuccess('Veículo atualizado com sucesso!');
      } else {
        await createVehicle(dataToSend);
        onSuccess('Veículo adicionado com sucesso!');
      }
    } catch (error) {
      console.error("Erro ao salvar veículo", error);
      onError('Erro ao salvar veículo.');
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCancelSubmit = () => {
    setOpenDialog(false);
  };

  return (
    <Container component={Paper} elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>
        {currentVehicle ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="proprietario"
              label="Proprietário"
              value={formData.proprietario}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!errors.proprietario}
              helperText={errors.proprietario}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="licensePlate"
              label="Placa"
              value={formData.licensePlate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 7 }}
              error={!!errors.licensePlate}
              helperText={errors.licensePlate}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="documento"
              label="Documento"
              value={formData.documento}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!errors.documento}
              helperText={errors.documento}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Cor</InputLabel>
              <Select
                name="cor"
                value={formData.cor}
                onChange={handleChange}
                label="Cor"
                error={!!errors.cor}
              >
                {colorOptions.map((color) => (
                  <MenuItem key={color} value={color}>{color}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.cor && <Typography color="error">{errors.cor}</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="valorRecebido"
              label="Valor Recebido"
              value={formData.valorRecebido}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="text"
              error={!!errors.valorRecebido}
              helperText={errors.valorRecebido}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
        >
          {currentVehicle ? 'Atualizar' : 'Salvar'}
        </Button>
      </form>
      <Dialog
        open={openDialog}
        onClose={handleCancelSubmit}
      >
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza de que deseja {currentVehicle ? 'atualizar' : 'adicionar'} este veículo?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmSubmit} color="secondary">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleForm;
