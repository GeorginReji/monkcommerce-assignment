import React, { useEffect, useState } from 'react';
import {
	Modal,
	Checkbox,
	ModalDialog,
	DialogTitle,
	Input,
	Button,
	Box,
	Stack,
	CircularProgress,
	Typography,
	Sheet,
	Grid,
	Divider,
	AspectRatio,
} from '@mui/joy';
import { getProductsData } from '../api/FetchProductsAPI';
import { Search } from '@mui/icons-material';

interface Product {
	id: string;
	title: string;
	color: string;
	size: string;
	price: number;
	available: number;

	image?: { id: number; product_id: number; src: string };
	variants: Variant[];

	checked: string | boolean;
}
interface Variant {
	id: string;
	productId: string;
	title: string;
	price: number;
	checked: boolean;
}

interface ProductSelectionModalProps {
	productModelVisible: boolean;
	setProductModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
	productModelVisible,
	setProductModelVisible,
}) => {
	// const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleProductCheckChange = (
		productIndex: number,
		checked: boolean
	) => {
		const updatedProducts = [...products];
		const currentProduct = updatedProducts[productIndex];

		// Update all variants of this product
		const updatedVariants = currentProduct.variants.map((variant) => ({
			...variant,
			checked,
		}));

		updatedProducts[productIndex] = {
			...currentProduct,
			checked: checked,
			variants: updatedVariants,
		};

		setProducts(updatedProducts);
	};

	const handleVariantCheckChange = (
		productIndex: number,
		variantIndex: number,
		checked: boolean
	) => {
		const updatedProducts = [...products];
		const currentProduct = updatedProducts[productIndex];
		const updatedVariants = [...currentProduct.variants];

		// Update specific variant
		updatedVariants[variantIndex] = {
			...updatedVariants[variantIndex],
			checked,
		};

		// Check if all variants are checked or some are checked
		const allVariantsChecked = updatedVariants.every(
			(variant) => variant.checked
		);
		const someVariantsChecked = updatedVariants.some(
			(variant) => variant.checked
		);

		updatedProducts[productIndex] = {
			...currentProduct,
			variants: updatedVariants,
			checked: allVariantsChecked
				? true
				: someVariantsChecked
				? 'indeterminate'
				: false,
		};

		setProducts(updatedProducts);
	};

	// const handleAdd = () => {
	// 	onAdd(selectedProducts);
	// };
	useEffect(() => {
		if (productModelVisible) {
			console.log('useEffect triggered');

			const fetchProductData = async () => {
				try {
					setIsLoading(true);
					const productData: Product[] = await getProductsData({});
					setProducts(productData);
				} catch (error) {
					console.error('Error fetching product data:', error);
				} finally {
					setIsLoading(false);
				}
			};
			fetchProductData();
		}
	}, [productModelVisible]);

	return (
		<Modal
			open={productModelVisible}
			onClose={() => setProductModelVisible(false)}
		>
			<ModalDialog>
				<DialogTitle>Search Products</DialogTitle>
				<Input
					startDecorator={<Search />}
					placeholder="Search product"
				/>
				{isLoading ? (
					<Stack
						display="flex"
						justifyContent="center"
						alignItems="center"
					>
						<CircularProgress />
					</Stack>
				) : (
					<Sheet
						sx={{
							maxWidth: 800,
							height: 300,
							overflow: 'auto',
							overflowX: 'hidden',
							px: 2,
						}}
					>
						<Grid container spacing={2}>
							{products.map(
								(product: Product, productIndex: number) => (
									<Grid xs={12} key={product.id}>
										<Grid
											display="flex"
											direction="row"
											gap={2}
											alignItems="center"
										>
											<Grid>
												<Checkbox
													checked={
														product.checked === true
													}
													indeterminate={
														product.checked ===
														'indeterminate'
													}
													onChange={(e) =>
														handleProductCheckChange(
															productIndex,
															e.target.checked
														)
													}
												/>
											</Grid>
											{product.image?.src ? (
												<AspectRatio
													ratio="1"
													sx={{ width: 70, p: 1 }}
												>
													<img
														src={product.image.src}
														alt={product.title}
														loading="lazy"
													/>
												</AspectRatio>
											) : (
												<Box
													sx={{
														width: '50px',
														height: '50px',
														backgroundColor:
															'#cbd5e1',
													}}
												>
													<Typography
														p={1}
														fontSize={'small'}
													>
														Image error
													</Typography>
												</Box>
											)}
											<Grid sx={{ mr: 8 }}>
												<Typography level="title-md">
													{product.title}
												</Typography>
											</Grid>
										</Grid>
										<Divider sx={{ mt: 1 }} inset="none" />

										<Grid ml={3} pt={2}>
											{product.variants.map(
												(
													variant: Variant,
													variantIndex: number
												) => (
													<>
														<Grid
															xs={12}
															key={variant.id}
														>
															<VariantRow
																quantity={99}
																{...variant}
																checked={
																	variant.checked ||
																	false
																}
																onCheckChange={(
																	checked
																) =>
																	handleVariantCheckChange(
																		productIndex,
																		variantIndex,
																		checked
																	)
																}
															/>
														</Grid>
														<Divider inset="none" />
													</>
												)
											)}
										</Grid>
									</Grid>
								)
							)}
						</Grid>
					</Sheet>
				)}
				<Box
					sx={{
						mt: 1,
						display: 'flex',
						gap: 1,
						flexDirection: { xs: 'column', sm: 'row-reverse' },
					}}
				>
					<Button
						variant="solid"
						color="primary"
						onClick={() => setProductModelVisible(false)}
					>
						Add
					</Button>
					<Button
						variant="outlined"
						color="neutral"
						onClick={() => setProductModelVisible(false)}
					>
						Cancel
					</Button>
				</Box>
			</ModalDialog>
		</Modal>
	);
};

interface VariantRowProps {
	id: string;
	productId: string;
	title: string;
	quantity: number;
	price: number;
	checked: boolean;
	onCheckChange: (checked: boolean) => void;
}
const VariantRow: React.FC<VariantRowProps> = ({
	id,
	productId,
	title,
	quantity = 0,
	price,
	checked = false,
	onCheckChange,
}) => {
	return (
		<Stack
			flex={1}
			direction="row"
			justifyContent="space-between"
			columnGap={1}
		>
			<Stack direction="row" gap={2}>
				<Checkbox
					checked={checked}
					onChange={(e) => onCheckChange?.(e.target.checked)}
				/>
				<Typography>{title}</Typography>
			</Stack>
			<Box>
				<Typography>{quantity} available</Typography>
			</Box>
			<Box>
				<Typography>${price}</Typography>
			</Box>
		</Stack>
	);
};

export default ProductSelectionModal;
