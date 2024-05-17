import { Box, Button, Grid, TextField } from "@mui/material";
import ToastMessage from "../toast-message/ToastMessage";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_STATUS } from "../../api/status/mutations";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';

export interface AddStatusComponentProps {
  visible: boolean;
  closeAddStatus: () => void;
  projId: string;
  refetchStatuses: () => void;
}

export interface StatusFormValues {
  statusName: string;
}

const StatusSchema = Yup.object().shape({
  statusName: Yup.string().required('Required')
});

export function AddStatusComponent(props: AddStatusComponentProps) {
  const [createNewStatus, { data, error, loading }] = useMutation(CREATE_NEW_STATUS);

  const closeHandler = () => {
    props.closeAddStatus();
  }

  const initValue: StatusFormValues = {
    statusName: ""
  }

  const addStatus = async (values: StatusFormValues, { setSubmitting, resetForm }: FormikHelpers<StatusFormValues>) => {
    setSubmitting(true);
    try {
      const res = await createNewStatus({
        variables: {
          projId: props.projId,
          statusName: values.statusName,
          statusId: "",
          orgId: "",
          userId:""
        },
      });
      const statusId: string | null = res.data?.createNewStatus?.statusId;
      if (statusId) {
        resetForm();
        closeHandler();
        props.refetchStatuses();
      }
    } catch (e) {
      console.error('Error creating status:', e);
    } finally {
      setSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: StatusSchema,
    onSubmit: addStatus,
  });

  return (
    <>
      {props.visible ? (
        <Box
          id='add-status-form'
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <ToastMessage
            severity="success"
            openFlag={data?.createNewStatus?.statusId ? true : false}
            message='Status created.'
          />

          <ToastMessage
            severity="error"
            openFlag={error ? true : false}
            message='Problem while creating status.'
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="statusName"
                label="Status Name"
                name="statusName"
                autoComplete="off"
                size="small"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.statusName && Boolean(formik.errors.statusName)}
                helperText={formik.touched.statusName && formik.errors.statusName}
              />
            </Grid>
            <Grid item xs={2}>
              <Button disabled={loading} size="small" style={{ borderRadius: 10 }} form="add-status-form" variant="contained" type='submit'>
                Submit
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button disabled={loading} size="small" onClick={closeHandler} style={{ borderRadius: 10 }} variant="contained" type='button' color="inherit">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </>
  );
}

export default AddStatusComponent;
