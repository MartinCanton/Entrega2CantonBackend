document.addEventListener('DOMContentLoaded', () => {
  const addProductForm = document.getElementById("add-product-form");
  const deleteProductForm = document.getElementById("delete-product-form");

  addProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(addProductForm);
    const productData = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")) || 0,
      thumbnails: formData.get("thumbnails") || "https://via.placeholder.com/150",
      code: formData.get("code"),
      stock: parseInt(formData.get("stock")) || 0,
      category: formData.get("category"),
      status: formData.get("status") === "true",
    };
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el producto");
      }
      Swal.fire("¡Producto agregado!", "El producto se agregó correctamente.");
    } catch (error) {
      Swal.fire("Error", `Ocurrió un error: ${error.message}`);
    }
  });

  deleteProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const productId = document.getElementById("productId").value;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }
      Swal.fire("¡Producto eliminado!", `El producto con ID ${productId} fue eliminado.`);
    } catch (error) {
      Swal.fire("Error", `Ocurrió un error: ${error.message}`);
    }
  });
});
