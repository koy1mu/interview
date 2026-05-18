import { styled } from "@mui/material/styles";
import { Container, Paper, Chip } from "@mui/material";

export const PageContainer = styled(Container)(({ theme }) => ({
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),
}));

export const FormPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	marginBottom: theme.spacing(3),
}));
