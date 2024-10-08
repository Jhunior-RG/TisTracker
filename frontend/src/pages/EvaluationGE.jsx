import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid2,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCompanyByIdQuery } from "../api/companyApi";
import { useCreateCompanyEvaluationMutation } from "../api/evaluationApi";
import DialogMod from "../components/DialogMod";
import Question from "../components/evaluation/Question";
import RadioOption from "../components/evaluation/RadioOption";
import EvaluateContext from "../context/evaluateContext/EvaluateContext";
import { evaluate } from "../utils/evaluaLikert";
import { ejemploEvaluacion } from "../mock_objects/evaluation";

const EvaluationGE = () => {
  const { company_id } = useParams();
  const {
    data: company,
    isSuccess: companySuccess,
    isFetching: companyFetching,
    isError: isCompanyError,
    error: companyError,
    isLoading: companyLoading,
  } = useGetCompanyByIdQuery(company_id);

  useEffect(() => {
    if (companySuccess) {
      console.log(company);
    }
    if (isCompanyError) {
      console.log(companyError);
    }
  }, [
    company,
    companyFetching,
    isCompanyError,
    companyError,
    companySuccess,
    companyLoading,
  ]);

  const [
    createCompanyEvaluation,
    { data, isSuccess, isError, error, isLoading },
  ] = useCreateCompanyEvaluationMutation();

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      setOpen(false)
      setSnackbarMessage("Evaluación enviada correctamente.");
      setOpenSnack(true);
      setOpenConfirmModal(true);
    }
    if (isError) {
      console.log(error);
      setOpen(false)
      setSnackbarMessage("Error al enviar la evaluación " || error?.data?.message);
      setOpenSnack(true);
      setAlreadyEvaluated(true)
    }
  }, [data, isSuccess, isError, error, isLoading]);

  const { state, setInitialState, verifyFields, clearState } =
    useContext(EvaluateContext);
  const [open, setOpen] = useState(false);
  const [openAlreadyEvaluated, setAlreadyEvaluated] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearState();
    setInitialState(ejemploEvaluacion.evaluation);
    setLoading(false);
  }, []);

  const handleAccept = () => {
    if (!state.isValid) {
      setOpenSnack(!openSnack);
      setOpen(!setOpen);
      return;
    }

    const finalGrade = evaluate(state.questions);
    console.log({
      company_id: company_id,
      score: parseInt(finalGrade, 10),
      type: "evaluation",
    });
    createCompanyEvaluation({
      company_id: company_id,
      score: parseInt(finalGrade, 10),
      type: "evaluation",
    });
    //navigate("/");
  };

  const handleConfirmAccept = () => {
    setOpenConfirmModal(false);
    navigate("/");
  };

  if (companyFetching || loading || isLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    !loading && (
      <Container sx={{ paddingY: 1 }} maxWidth="xl">
        <Typography
          component="h1"
          sx={{ fontSize: "40px", lineHeight: "1", marginY: 3 }}
        >
          {state.title}
        </Typography>

        <Typography
          component="h3"
          sx={{ fontSize: "20px", lineHeight: "1", marginY: 3 }}
        >
          {state.description}
        </Typography>

        <Typography
          component="h3"
          sx={{ fontSize: "20px", lineHeight: "1", marginY: 3 }}
        >
          <strong>Grupo Empresa a evaluar: </strong>{" "}
          {company?.company?.short_name}
        </Typography>

        <Typography
          component="h2"
          sx={{ fontSize: "30px", lineHeight: "1", marginY: 3 }}
        >
          Criterios de Evaluación
        </Typography>

        <Grid2 container spacing={2}>
          {state.questions.map((e, index = 0) => {
            return (
              <>
                <Grid2 size={{ sm: 12, md: 6 }}>
                  <Question key={e.id} question={`${index + 1}. ${e.text}`} />
                </Grid2>
                <RadioOption
                  key={e.id}
                  answer_options={e.answer_options}
                  question_id={e.id}
                />
                <Divider sx={{ width: "100%" }} />{" "}
              </>
            );
          })}
        </Grid2>
        <Box sx={{ display: "flex", justifyContent: "center", margin: 5 }}>
          <Button
            variant="contained"
            sx={{ paddingX: 8, paddingY: 1 }}
            onClick={() => {
              verifyFields();
              setOpen(true);
            }}
          >
            Enviar
          </Button>
          <DialogMod
            open={open}
            setOpen={setOpen}
            title={"Enviar"}
            content={"¿Estás seguro de realizar esta acción?"}
            onAccept={handleAccept}
          />
          <DialogMod
            open={openConfirmModal}
            setOpen={setOpenConfirmModal}
            title={"Confirmación"}
            content={"Evaluación enviada correctamente."}
            onAccept={handleConfirmAccept}
            showButtonCancel={false}
          />
          <DialogMod
            open={openAlreadyEvaluated}
            setOpen={setAlreadyEvaluated}
            title={"Error"}
            content={error?.data?.message}
            onAccept={() => navigate("/")}
            showButtonCancel={false}
          />
          <Snackbar
            open={openSnack}
            autoHideDuration={10000}
            onClose={() => setOpenSnack(!openSnack)}
            message={snackbarMessage}
          />
        </Box>
      </Container>
    )
  );
};

export default EvaluationGE;
