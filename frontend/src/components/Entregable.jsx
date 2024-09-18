import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState } from "react";
import Hu from "./Hu";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const Entregable = ({
  entregable,
  onUpdate,
  onDelete,
  trigger,
  setTrigger,
  toEdit = false,
}) => {
  const [formData, setFormData] = useState({
    id: entregable?.id,
    nombre_hito: entregable?.nombre_hito || "",
    fecha_ini: entregable?.fecha_ini || "",
    fecha_entrega: entregable?.fecha_entrega || "",
    cobro: entregable?.cobro || "",
    hu: entregable?.hu || [],
  });

  const [errors, setErrors] = useState({
    nombre_hito: "",
    fecha_ini: "",
    fecha_entrega: "",
    cobro: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newFormData = { ...prevState, [name]: value };
      setErrors({ ...errors, [name]: "" });
      onUpdate(newFormData);
      return newFormData;
    });
  };

  const handleDateIniChange = (e) => {
    let f = "fecha_ini";
    try {
      const value = new Date(e).toISOString();
      setFormData((prevState) => {
        const newFormData = { ...prevState, [f]: value };
        setErrors({ ...errors, [f]: "" });
        onUpdate(newFormData);
        return newFormData;
      });
    } catch (error) {
      console.error("Error al manejar la fecha:", error);
    }
  };

  const handleDateFinChange = (e) => {
    let f = "fecha_entrega";
    try {
      const value = new Date(e).toISOString();
      setFormData((prevState) => {
        const newFormData = { ...prevState, [f]: value };
        setErrors({ ...errors, [f]: "" });
        onUpdate(newFormData);
        return newFormData;
      });
    } catch (error) {
      console.error("Error al manejar la fecha:", error);
    }
  };

  const handleAgregarHu = () => {
    let x = "hu";
    let actual = formData.hu;
    let nuevo = [
      ...actual,
      { id: Date.now(), nombre_hu: "", responsable: "", objetivo: "" },
    ];
    setFormData({ ...formData, [x]: nuevo });
  };

  const handleEliminarHu = (id) => {
    let x = "hu";
    setFormData({ ...formData, [x]: formData.hu.filter((e) => e.id !== id) });
  };

  const handleUpdateHu = (updatedData) => {
    let x = "hu";
    let nuevo = formData.hu.map((e) =>
      e.id === updatedData.id ? updatedData : e
    );

    // Actualiza el estado y luego llama a onUpdate con el valor nuevo
    const updatedFormData = { ...formData, [x]: nuevo };
    setFormData(updatedFormData);
    onUpdate(updatedFormData); // Pasamos el valor actualizado a onUpdate
  };

  const handleRegister = () => {
    const { nombre_hito, fecha_ini, fecha_entrega, cobro } = formData;
    let hasError = false;
    const newErrors = {};

    const validations = {
      nombre_hito: {
        condition: !nombre_hito,
        message: "El nombre del producto entregable es obligatorio.",
      },
      fecha_ini: {
        condition: !fecha_ini,
        message: "La fecha de inicio es obligatoria.",
      },
      fecha_entrega: {
        condition: !fecha_entrega,
        message: "La fecha de entrega es obligatoria.",
      },
      cobro: {
        condition: !cobro,
        message: "El cobro en porcentaje es obligatorio.",
      },
    };

    for (const [field, { condition, message }] of Object.entries(validations)) {
      if (condition) {
        newErrors[field] = message;
        hasError = true;
      }
    }

    if (formData.hu.length === 0) {
      setTrigger(false);
    }

    if (hasError) {
      setErrors(newErrors);
      setTrigger(false);
      return;
    }
  };

  useEffect(() => {
    if (trigger) {
      handleRegister();
      setTrigger(false); // Asegúrate de restablecer el trigger
    }
  }, [trigger]);

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <TextField
        label="Nombre del hito*"
        variant="outlined"
        name="nombre_hito"
        fullWidth
        sx={{ marginBottom: 2 }}
        onChange={handleInputChange}
        value={formData.nombre_hito}
        error={Boolean(errors.nombre_hito)}
        helperText={errors.nombre_hito}
        aria-describedby="nombre_hito-error"
        multiline
        slotProps={{
          input: {
            readOnly: toEdit,
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          flexWrap: "wrap",
          "& > *": {
            flex: 1,
            minWidth: { xs: "100%", sm: "auto" },
            boxSizing: "border-box",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Fecha de inicio MM/DD/YYYY*"
            value={formData.fecha_ini ? new Date(formData.fecha_ini) : null}
            onChange={handleDateIniChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(errors.fecha_ini)}
                helperText={errors.fecha_ini}
                aria-describedby="fecha_ini-error"
              />
            )}
            readOnly={toEdit}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Fecha de entrega MM/DD/YYYY*"
            value={
              formData.fecha_entrega ? new Date(formData.fecha_entrega) : null
            }
            onChange={handleDateFinChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(errors.fecha_entrega)}
                helperText={errors.fecha_entrega}
                aria-describedby="fecha_entrega-error"
              />
            )}
            readOnly={toEdit}
          />
        </LocalizationProvider>
      </Box>

      <TextField
        label="Porcentaje de cobro (%)"
        variant="outlined"
        name="cobro"
        fullWidth
        sx={{ margin: "16px 0" }}
        onChange={handleInputChange}
        value={formData.cobro}
        error={Boolean(errors.cobro)}
        helperText={errors.cobro}
        aria-describedby="cobro-error"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">%</InputAdornment>,
            readOnly: toEdit,
          },
        }}
      />

      <Typography variant="h4" sx={{ marginY: 2 }}>
        Entregables
      </Typography>

      <Stack spacing={2}>
        {formData.hu.map((e) => (
          <Hu
            key={e.id}
            handleEliminarHu={handleEliminarHu}
            onUpdate={handleUpdateHu}
            info={e}
            trigger={trigger}
            setTrigger={setTrigger}
            toEdit={toEdit}
          />
        ))}
        <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAgregarHu}
          >
            Agregar entregable
          </Button>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <IconButton
          onClick={onDelete}
          color="error"
          aria-label="Eliminar entregable"
          sx={{ ml: 2 }}
        >
          <DeleteIcon /> Quitar hito
        </IconButton>
      </Box>
    </Box>
  );
};

export default Entregable;
