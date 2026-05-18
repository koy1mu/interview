import { useState, useEffect, useCallback } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { api, Category } from "../lib/api";
import { FormPaper } from "./styled";

export function CategoriesTab() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [name, setName] = useState("");
	const [color, setColor] = useState("#1976d2");

	const loadCategories = useCallback(async () => {
		setCategories(await api.getCategories());
	}, []);

	useEffect(() => {
		loadCategories();
	}, [loadCategories]);

	const handleCreate = async () => {
		if (!name.trim()) return;
		await api.createCategory(name, color);
		setName("");
		setColor("#1976d2");
		loadCategories();
	};

	const handleDelete = async (id: string) => {
		await api.deleteCategory(id);
		loadCategories();
	};

	return (
		<Box>
			<FormPaper elevation={2}>
				<Typography variant="h6" gutterBottom>
					New Category
				</Typography>
				<Stack direction="row" spacing={2} alignItems="flex-end">
					<TextField
						label="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						size="small"
						sx={{ flex: 1 }}
					/>
					<TextField
						label="Color"
						type="color"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						size="small"
						sx={{ width: 100 }}
					/>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={handleCreate}
					>
						Add
					</Button>
				</Stack>
			</FormPaper>

			<List>
				{categories.map((cat) => (
					<ListItem key={cat._id} divider>
						<Box
							sx={{
								width: 24,
								height: 24,
								borderRadius: "50%",
								backgroundColor: cat.color,
								mr: 2,
							}}
						/>
						<ListItemText primary={cat.name} />
						<ListItemSecondaryAction>
							<IconButton edge="end" onClick={() => handleDelete(cat._id)}>
								<DeleteIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
				{categories.length === 0 && (
					<Typography
						color="text.secondary"
						sx={{ py: 3, textAlign: "center" }}
					>
						No categories yet.
					</Typography>
				)}
			</List>
		</Box>
	);
}
