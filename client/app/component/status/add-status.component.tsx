import { Box, Button, Grid, TextField } from "@mui/material";
import ToastMessage from "../toast-message/ToastMessage";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_STATUS, EDIT_STATUS } from "../../api/status/mutations";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from 'yup';

export interface AddStatusComponentProps {
  visible: boolean;
  closeAddStatus: () => void;
  projId: string;
  statusId?: string;
  statusDetails?: Status | null;
  statusName?: string;
  orgId: string;
  userId: string;
}

export interface StatusFormValues {
  statusName: string;
}

export interface Status {
  statusId: string;
  statusName: string;
  projId: string;
  orgId: string;
  userId: string;
}

const StatusSchema = Yup.object().shape({
  statusName: Yup.string().required('Required'),
});

export function AddStatusComponent(props: AddStatusComponentProps) {
  const [createNewStatus, { data: createData, error: createError, loading: createLoading }] = useMutation(CREATE_NEW_STATUS);
  const [editStatus, { error: updateError, loading: updateLoading }] = useMutation(EDIT_STATUS);

  const closeHandler = () => {
    props.closeAddStatus();
  };

  const initialValues: StatusFormValues = props.statusDetails ? {
    statusName: props.statusDetails.statusName,
  } : {
    statusName: "",
  };

  const addOrUpdateStatus = async (values: StatusFormValues, { setSubmitting, resetForm }: FormikHelpers<StatusFormValues>) => {
    setSubmitting(true);
    try {
      // console.log("orgId",props.orgId);
      // console.log("userId",props.userId);
      if (props.statusDetails) {
        console.log("props.statusDetails",props.statusDetails);
        await editStatus({
          variables: {
            statusId: props.statusDetails.statusId,
            statusName: values.statusName,
            projId: props.projId,
            orgId: props.orgId,
            userId: props.userId,
          },
        });
      } else {
        console.log("props.orgId",props.orgId);
        await createNewStatus({
          variables: {
            statusId: "",
            statusName: values.statusName,
            projId: props.projId,
            orgId: props.orgId,
            userId:props.userId,
          },
        });
      }
      resetForm();
      closeHandler();
    } catch (error) {
      console.error('Error:', error);
    }
    setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: StatusSchema,
    onSubmit: addOrUpdateStatus,
  });

  return (
    <>
      {props.visible ?
        <Box
          id='add-status-form'
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ mt: 3 }}
        >
          <ToastMessage
            severity="success"
            openFlag={createData?.createNewStatus?.statusId ? true : false}
            message='Status created.'
          />
          <ToastMessage
            severity="error"
            title={`Problem while ${createError?.message ? "creating" : "updating"} status.`}
            openFlag={createError || updateError ? true : false}
            message={(createError || updateError)?.message || ""}
          />
          <Grid container spacing={2}>
            <Grid item xs={8}>
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
                value={formik.values.statusName}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={createLoading || updateLoading}
                size="small"
                style={{ borderRadius: 10 }}
                variant="contained"
                type='submit' 
              >
                Submit
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={createLoading || updateLoading}
                size="small"
                onClick={closeHandler}
                style={{ borderRadius: 10 }}
                variant="contained"
                type='button'
                color="inherit"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
        : null}
    </>
  );
}

export default AddStatusComponent;
