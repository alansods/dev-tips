# O mesmo CRUD em quatro frameworks, passo a passo

Vamos construir um CRUD completo de produtos (criar, listar, buscar, atualizar e apagar) e ver, etapa por etapa, como cada framework resolve a mesma coisa.

Frameworks comparados: Express (JavaScript/TypeScript), Spring Boot (Java), NestJS (TypeScript), FastAPI (Python).

## O que vamos criar

Uma API de CRUD de produtos. Cada letra do CRUD vira pelo menos um endpoint, que o frontend chamaria com `fetch`. São cinco no total. Os dados ficam guardados num banco PostgreSQL rodando no Docker, igual para os quatro.

| Método | Caminho | O que faz |
|---|---|---|
| POST | /products | C: cria um produto |
| GET | /products | R: lista os produtos, em páginas |
| GET | /products/1 | R: busca um produto pelo id |
| PUT | /products/1 | U: atualiza um produto |
| DELETE | /products/1 | D: apaga um produto |

## Passo a passo

### Passo 1: Criar o projeto

**O que é:** criar a pasta do projeto com a estrutura inicial.

**Por que importa:** alguns frameworks têm um gerador que já monta tudo (como o `npm create vite` que você usa no frontend). Outros você monta na mão.

#### Express (terminal)

```bash
mkdir products-express
cd products-express
npm init -y
```

**Sem gerador.** Você começa com uma pasta vazia e um package.json e monta o resto.

#### Spring Boot (start.spring.io)

```java
# No site start.spring.io, escolha:
#   Project: Maven   Language: Java
#   Dependencies: Spring Web, Spring Data JPA,
#                 PostgreSQL Driver, Validation
# Clique em Generate, descompacte e abra a pasta.
```

**Gerador no site.** Você marca o que quer e baixa um projeto pronto.

#### NestJS (terminal)

```bash
npm i -g @nestjs/cli
nest new products-nest
cd products-nest
nest g resource products
```

**Gerador por linha de comando.** O `nest g resource` já cria controller, service, módulo e DTOs de products.

#### FastAPI (terminal)

```bash
mkdir products-fastapi
cd products-fastapi
python -m venv .venv
source .venv/bin/activate
```

**Sem gerador.** Você cria um venv (Python), que isola as bibliotecas do projeto.

### Passo 2: Instalar as bibliotecas

**O que é:** baixar as bibliotecas que o projeto usa: o framework, o driver do PostgreSQL e a ferramenta de validação.

**Por que importa:** mostra o quanto cada framework já traz pronto. O Express traz pouco; o Spring traz quase tudo.

#### Express (terminal)

```bash
npm install express pg zod cors
npm install -D typescript tsx @types/node \
  @types/express @types/pg @types/cors \
  vitest supertest @types/supertest
```

Você escolhe cada peça: `pg` fala com o banco, `zod` valida, `cors` libera o frontend.

#### Spring Boot (pom.xml)

```xml
<!-- Já veio do gerador. O pom.xml é o
     "package.json" do Java. -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

Não precisa instalar nada à mão: o Maven baixa tudo ao rodar o projeto.

#### NestJS (terminal)

```bash
npm install @nestjs/typeorm typeorm pg \
  class-validator class-transformer
```

`typeorm` é o ORM; `class-validator` faz a validação.

#### FastAPI (terminal)

```bash
pip install "fastapi[standard]" sqlalchemy "psycopg[binary]"
pip freeze > requirements.txt
```

`pip` é o "npm" do Python e `requirements.txt` é a lista de dependências.

### Passo 3: Subir o banco e conectar

**O que é:** ligar o PostgreSQL com Docker (o mesmo `docker-compose.yml` serve para os quatro) e dizer à API onde o banco está.

**Por que importa:** o endereço e a senha do banco ficam fora do código, numa variável de ambiente ou arquivo de configuração.

#### Express (.env + src/db.ts)

```ts
# .env
DATABASE_URL=postgres://products:products@localhost:5432/productsdb

// src/db.ts
import pg from 'pg';
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
```

Você cria o pool de conexões manualmente.

#### Spring Boot (application.properties)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/productsdb
spring.datasource.username=products
spring.datasource.password=products
spring.jpa.hibernate.ddl-auto=update
```

Só configuração, sem código. O `ddl-auto=update` faz o Spring criar a tabela sozinho.

#### NestJS (src/app.module.ts)

```ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // cria a tabela (só em dev)
    }),
    ProductsModule,
  ],
})
export class AppModule {}
```

Configurado dentro de um módulo, usando decorators.

#### FastAPI (app/database.py)

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

`get_db` abre uma sessão com o banco para cada pedido e fecha no final.

### Passo 4: Definir a tabela de produtos

**O que é:** descrever as colunas da tabela: id, nome, descrição, preço, estoque e data de criação.

**Por que importa:** com ORM você escreve uma classe (entidade) e ele cria a tabela. Sem ORM, como no Express do guia, você escreve o SQL da tabela.

#### Express (db/init.sql)

```sql
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)   NOT NULL,
  description VARCHAR(500),
  price       NUMERIC(12, 2) NOT NULL CHECK (price > 0),
  stock       INTEGER        NOT NULL CHECK (stock >= 0),
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);
```

**SQL puro.** E à parte uma `interface Product` no TypeScript.

#### Spring Boot (Product.java)

```java
@Entity
@Table(name = "products")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(length = 500)
  private String description;

  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal price;

  @Column(nullable = false)
  private Integer stock;

  @CreationTimestamp
  private Instant createdAt;
  // getters e setters
}
```

**Classe com anotações.** O `@Entity` diz "isto é uma tabela".

#### NestJS (product.entity.ts)

```ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string | null;

  @Column('numeric', {
    precision: 12, scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => Number(v) },
  })
  price: number;

  @Column('int')
  stock: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

Muito parecido com o Spring. O `transformer` converte o preço, que o banco devolve como texto, em número.

#### FastAPI (app/models.py)

```python
class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str | None] = mapped_column(String(500))
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2))
    stock: Mapped[int]
    created_at: Mapped[datetime] = mapped_column(
        server_default=func.now())

# em main.py: Base.metadata.create_all(engine)
```

Classe Python. Os tipos (`Mapped[int]`) dizem o tipo da coluna.

### Passo 5: Definir e validar os dados de entrada

**O que é:** dizer como deve ser o JSON que o frontend envia (o DTO) e quais regras ele precisa cumprir.

**Por que importa:** se alguém mandar preço negativo, a API recusa com status 400 antes de chegar no banco. É a mesma ideia de validar um formulário com Zod no frontend.

#### Express (product.schema.ts)

```ts
export const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('O preço deve ser maior que zero'),
  stock: z.number().int().min(0),
});

export type ProductInput = z.infer<typeof productSchema>;
```

**Zod**, igual ao frontend. O tipo TypeScript sai do próprio schema.

#### Spring Boot (ProductRequest.java)

```java
public record ProductRequest(
  @NotBlank @Size(min = 3, max = 100) String name,
  @Size(max = 500) String description,
  @NotNull @Positive BigDecimal price,
  @NotNull @PositiveOrZero Integer stock
) {}
```

**Anotações** em cada campo. `record` é uma classe só de dados.

#### NestJS (create-product.dto.ts)

```ts
export class CreateProductDto {
  @IsString() @Length(3, 100)
  name: string;

  @IsOptional() @IsString() @MaxLength(500)
  description?: string;

  @IsPositive()
  price: number;

  @IsInt() @Min(0)
  stock: number;
}

// main.ts: liga a validação para toda a API
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
```

Classe com decorators, no mesmo estilo do Spring.

#### FastAPI (app/schemas.py)

```python
class ProductIn(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    description: str | None = Field(default=None, max_length=500)
    price: Decimal = Field(gt=0)
    stock: int = Field(ge=0)

class ProductOut(ProductIn):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
```

**Pydantic.** A validação acontece sozinha só por usar essa classe na rota.

### Passo 6: Montar a estrutura em camadas

**O que é:** criar os três arquivos que todo CRUD vai usar e ligá-los entre si: Repository (fala com o banco), Service (regras) e Controller (recebe o pedido e responde).

**Por que importa:** nos próximos 5 passos cada operação do CRUD vai passar por essas três camadas, sempre nessa ordem: controller → service → repository → banco.

#### Express (routes + app.ts + errors.ts)

```ts
// src/errors.ts
export class NotFoundError extends Error {}

// src/products/product.routes.ts
export const productRoutes = Router();
productRoutes.post('/', controller.create);
productRoutes.get('/', controller.list);
productRoutes.get('/:id', controller.get);
productRoutes.put('/:id', controller.update);
productRoutes.delete('/:id', controller.remove);

// src/app.ts
app.use(express.json()); // transforma o corpo em objeto
app.use('/products', productRoutes);

// o service importa o repository e o controller
// importa o service: import * as service from ...
```

**Ligação por import.** Cada camada é um arquivo com funções; não há injeção de dependência.

#### Spring Boot (Repository, Service e Controller)

```java
// ProductRepository.java (pronto, sem SQL)
public interface ProductRepository
    extends JpaRepository<Product, Long> {}

// ProductService.java
@Service
public class ProductService {
  private final ProductRepository repository;
  public ProductService(ProductRepository repository) {
    this.repository = repository;
  }
}

// ProductController.java
@RestController
@RequestMapping("/products")
public class ProductController {
  private final ProductService service;
  public ProductController(ProductService service) {
    this.service = service;
  }
}

// ProductNotFoundException.java
public class ProductNotFoundException extends RuntimeException {
  public ProductNotFoundException(Long id) {
    super("Produto não encontrado: " + id);
  }
}
```

**Ligação pelo construtor.** O Spring cria cada classe e entrega a outra pronta (injeção de dependência).

#### NestJS (products.module.ts + service + controller)

```ts
// products.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

// products.service.ts
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}
}

// products.controller.ts
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}
}
```

**Ligação pelo construtor + módulo.** O módulo diz ao Nest quais peças existem. O repository vem pronto do TypeORM.

#### FastAPI (main.py + router.py + service.py)

```python
# app/router.py
router = APIRouter(prefix="/products", tags=["products"])

# app/main.py
app = FastAPI()
Base.metadata.create_all(engine)
app.include_router(router)

# app/service.py (funções que recebem a sessão do banco)
class ProductNotFound(Exception):
    def __init__(self, product_id: int):
        super().__init__(f"Produto não encontrado: {product_id}")

# Não há repository: a sessão (db) faz esse papel.
# Cada rota recebe db via Depends(get_db).
```

**Ligação por import + `Depends()`.** O FastAPI entrega a sessão do banco em cada rota.

### Passo 7: C: Criar produto

**Endpoint:** `POST /products` com o produto no corpo. Responde **201 Created** com o produto salvo (já com id).

**Caminho:** o controller valida o corpo, o service manda salvar, o repository insere no banco e devolve a linha criada.

#### Express (repository + service + controller)

```ts
// product.repository.ts
export async function insert(input: ProductInput) {
  const { rows } = await pool.query<ProductRow>(
    `INSERT INTO products (name, description, price, stock)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.name, input.description ?? null, input.price, input.stock],
  );
  return toProduct(rows[0]);
}

// product.service.ts
export const create = (input: ProductInput) =>
  repository.insert(input);

// product.controller.ts
export async function create(req: Request, res: Response) {
  const input = productSchema.parse(req.body);
  const created = await service.create(input);
  res.status(201).location('/products/' + created.id).json(created);
}
```

O `toProduct` converte a linha do banco (snake_case, preço como texto) para o formato do JS.

#### Spring Boot (Service + Controller)

```java
// ProductService.java
public Product create(ProductRequest req) {
  Product p = new Product();
  p.setName(req.name());
  p.setDescription(req.description());
  p.setPrice(req.price());
  p.setStock(req.stock());
  return repository.save(p); // INSERT gerado pelo JPA
}

// ProductController.java
@PostMapping
public ResponseEntity<Product> create(
    @Valid @RequestBody ProductRequest req) {
  Product p = service.create(req);
  return ResponseEntity
    .created(URI.create("/products/" + p.getId()))
    .body(p);
}
```

`repository.save()` já existe. `@Valid` valida o corpo antes de entrar no método.

#### NestJS (service + controller)

```ts
// products.service.ts
create(dto: CreateProductDto) {
  const product = this.repo.create(dto); // monta o objeto
  return this.repo.save(product);        // INSERT
}

// products.controller.ts
@Post() // 201 por padrão
create(@Body() dto: CreateProductDto) {
  return this.service.create(dto);
}
```

O `ValidationPipe` global valida o DTO automaticamente.

#### FastAPI (service.py + router.py)

```python
# service.py
def create_product(db: Session, data: ProductIn) -> Product:
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)  # recarrega id e created_at
    return product

# router.py
@router.post("", response_model=ProductOut, status_code=201)
def create(data: ProductIn, db: Session = Depends(get_db)):
    return service.create_product(db, data)
```

`model_dump()` transforma o Pydantic em dicionário; `**` espalha os campos (como o spread do JS).

### Passo 8: R: Listar produtos

**Endpoint:** `GET /products?page=0&size=10`. Responde **200** com uma página de produtos.

**Por que paginar:** com milhares de produtos você não quer devolver tudo de uma vez. A resposta segue o mesmo formato nos quatro: `{ content, page, size, totalElements, totalPages }`.

#### Express (repository + service + controller)

```ts
// product.repository.ts
export async function findPage(page: number, size: number) {
  const [data, count] = await Promise.all([
    pool.query<ProductRow>(
      'SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2',
      [size, page * size]),
    pool.query<{ count: string }>('SELECT COUNT(*) FROM products'),
  ]);
  return { items: data.rows.map(toProduct),
           total: Number(count.rows[0].count) };
}

// product.service.ts
export async function list(page: number, size: number) {
  const { items, total } = await repository.findPage(page, size);
  return { content: items, page, size, totalElements: total,
           totalPages: Math.ceil(total / size) };
}

// product.controller.ts
export async function list(req: Request, res: Response) {
  const { page, size } = pageQuerySchema.parse(req.query);
  res.json(await service.list(page, size));
}
```

Você escreve o `LIMIT/OFFSET` e o `COUNT` na mão.

#### Spring Boot (Service + Controller)

```java
// ProductService.java
public Page<Product> list(Pageable pageable) {
  return repository.findAll(pageable);
}

// ProductController.java
@GetMapping
public Page<Product> list(
    @PageableDefault(size = 10, sort = "id") Pageable pageable) {
  return service.list(pageable);
}
// ?page=0&size=10 é lido automaticamente
```

**Paginação pronta.** O Spring lê `page` e `size` da URL e monta a resposta.

#### NestJS (service + controller)

```ts
// products.service.ts
async findAll(page: number, size: number) {
  const [content, totalElements] = await this.repo.findAndCount({
    order: { id: 'ASC' },
    skip: page * size,
    take: size,
  });
  return { content, page, size, totalElements,
           totalPages: Math.ceil(totalElements / size) };
}

// products.controller.ts
@Get()
findAll(
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
) {
  return this.service.findAll(page, size);
}
```

`findAndCount` busca a página e o total numa chamada só.

#### FastAPI (schemas.py + service.py + router.py)

```python
# schemas.py
class ProductPage(BaseModel):
    content: list[ProductOut]
    page: int
    size: int
    totalElements: int
    totalPages: int

# service.py
def list_products(db: Session, page: int, size: int):
    items = db.scalars(select(Product).order_by(Product.id)
                       .offset(page * size).limit(size)).all()
    total = db.scalar(select(func.count()).select_from(Product))
    return {"content": items, "page": page, "size": size,
            "totalElements": total,
            "totalPages": math.ceil(total / size)}

# router.py
@router.get("", response_model=ProductPage)
def list_all(page: int = Query(0, ge=0),
             size: int = Query(10, ge=1, le=100),
             db: Session = Depends(get_db)):
    return service.list_products(db, page, size)
```

`Query(0, ge=0)` define valor padrão e regra (maior ou igual a 0).

### Passo 9: R: Buscar um produto

**Endpoint:** `GET /products/1`. Responde **200** com o produto, ou **404** se ele não existir.

**Detalhe importante:** o repository só diz "não achei". Quem transforma isso em erro é o service. Esse método `get` é reaproveitado no atualizar e no apagar.

#### Express (repository + service + controller)

```ts
// product.repository.ts
export async function findById(id: number) {
  const { rows } = await pool.query<ProductRow>(
    'SELECT * FROM products WHERE id = $1', [id]);
  return rows[0] ? toProduct(rows[0]) : null;
}

// product.service.ts
export async function get(id: number) {
  const product = await repository.findById(id);
  if (!product) throw new NotFoundError('Produto não encontrado: ' + id);
  return product;
}

// product.controller.ts
export async function get(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params); // "1" -> 1
  res.json(await service.get(id));
}
```

O id chega da URL como texto; o Zod (`z.coerce.number()`) converte.

#### Spring Boot (Service + Controller)

```java
// ProductService.java
public Product get(Long id) {
  return repository.findById(id)
    .orElseThrow(() -> new ProductNotFoundException(id));
}

// ProductController.java
@GetMapping("/{id}")
public Product get(@PathVariable Long id) {
  return service.get(id);
}
```

`findById` devolve um `Optional` (uma "caixa" que pode estar vazia).

#### NestJS (service + controller)

```ts
// products.service.ts
async findOne(id: number) {
  const product = await this.repo.findOneBy({ id });
  if (!product) {
    throw new NotFoundException('Produto não encontrado: ' + id);
  }
  return product;
}

// products.controller.ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.service.findOne(id);
}
```

`ParseIntPipe` converte o id e responde 400 se não for número.

#### FastAPI (service.py + router.py)

```python
# service.py
def get_product(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if product is None:
        raise ProductNotFound(product_id)
    return product

# router.py
@router.get("/{product_id}", response_model=ProductOut)
def get_one(product_id: int, db: Session = Depends(get_db)):
    return service.get_product(db, product_id)
```

Só por declarar `product_id: int`, o FastAPI converte e valida.

### Passo 10: U: Atualizar produto

**Endpoint:** `PUT /products/1` com o produto completo no corpo. Responde **200** com o produto atualizado, ou **404**.

**Caminho:** valida o id e o corpo, confere se o produto existe, troca os campos e salva.

#### Express (repository + service + controller)

```ts
// product.repository.ts
export async function update(id: number, input: ProductInput) {
  const { rows } = await pool.query<ProductRow>(
    `UPDATE products
     SET name = $1, description = $2, price = $3, stock = $4
     WHERE id = $5 RETURNING *`,
    [input.name, input.description ?? null, input.price, input.stock, id],
  );
  return rows[0] ? toProduct(rows[0]) : null;
}

// product.service.ts
export async function update(id: number, input: ProductInput) {
  const product = await repository.update(id, input);
  if (!product) throw new NotFoundError('Produto não encontrado: ' + id);
  return product;
}

// product.controller.ts
export async function update(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  const input = productSchema.parse(req.body);
  res.json(await service.update(id, input));
}
```

Se nenhuma linha foi atualizada, o produto não existia: vira 404.

#### Spring Boot (Service + Controller)

```java
// ProductService.java
public Product update(Long id, ProductRequest req) {
  Product p = get(id); // 404 se não existir
  p.setName(req.name());
  p.setDescription(req.description());
  p.setPrice(req.price());
  p.setStock(req.stock());
  return repository.save(p); // vira UPDATE porque já tem id
}

// ProductController.java
@PutMapping("/{id}")
public Product update(@PathVariable Long id,
                      @Valid @RequestBody ProductRequest req) {
  return service.update(id, req);
}
```

O mesmo `save()` faz INSERT ou UPDATE, dependendo se o objeto já tem id.

#### NestJS (service + controller)

```ts
// products.service.ts
async update(id: number, dto: CreateProductDto) {
  const product = await this.findOne(id); // 404 se não existir
  Object.assign(product, dto);            // copia os campos novos
  return this.repo.save(product);         // UPDATE
}

// products.controller.ts
@Put(':id')
update(@Param('id', ParseIntPipe) id: number,
       @Body() dto: CreateProductDto) {
  return this.service.update(id, dto);
}
```

Reaproveita o `findOne` do passo anterior.

#### FastAPI (service.py + router.py)

```python
# service.py
def update_product(db: Session, product_id: int, data: ProductIn):
    product = get_product(db, product_id)  # 404 se não existir
    for field, value in data.model_dump().items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product

# router.py
@router.put("/{product_id}", response_model=ProductOut)
def update(product_id: int, data: ProductIn,
           db: Session = Depends(get_db)):
    return service.update_product(db, product_id, data)
```

`setattr` troca cada campo; o `commit` grava no banco.

### Passo 11: D: Apagar produto

**Endpoint:** `DELETE /products/1`. Responde **204 No Content** (deu certo, sem corpo), ou **404**.

**Caminho:** valida o id, apaga e confere se alguma linha foi realmente apagada.

#### Express (repository + service + controller)

```ts
// product.repository.ts
export async function remove(id: number) {
  const result = await pool.query(
    'DELETE FROM products WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0; // apagou alguma linha?
}

// product.service.ts
export async function remove(id: number) {
  const deleted = await repository.remove(id);
  if (!deleted) throw new NotFoundError('Produto não encontrado: ' + id);
}

// product.controller.ts
export async function remove(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);
  await service.remove(id);
  res.status(204).send();
}
```

A função se chama `remove` porque `delete` é palavra reservada no JS.

#### Spring Boot (Service + Controller)

```java
// ProductService.java
public void delete(Long id) {
  if (!repository.existsById(id)) {
    throw new ProductNotFoundException(id);
  }
  repository.deleteById(id);
}

// ProductController.java
@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable Long id) {
  service.delete(id);
}
```

`@ResponseStatus` define o 204.

#### NestJS (service + controller)

```ts
// products.service.ts
async remove(id: number) {
  const result = await this.repo.delete(id);
  if (!result.affected) {
    throw new NotFoundException('Produto não encontrado: ' + id);
  }
}

// products.controller.ts
@Delete(':id')
@HttpCode(204)
remove(@Param('id', ParseIntPipe) id: number) {
  return this.service.remove(id);
}
```

`affected` diz quantas linhas foram apagadas.

#### FastAPI (service.py + router.py)

```python
# service.py
def delete_product(db: Session, product_id: int) -> None:
    product = get_product(db, product_id)  # 404 se não existir
    db.delete(product)
    db.commit()

# router.py
@router.delete("/{product_id}", status_code=204)
def delete(product_id: int, db: Session = Depends(get_db)):
    service.delete_product(db, product_id)
```

`status_code=204` na própria rota.

### Passo 12: Tratar erros em um lugar só

**O que é:** um ponto central que transforma erros em respostas: "não encontrado" vira 404, dados inválidos viram 400.

**Por que importa:** sem isso, cada rota precisaria de `try/catch`. É parecido com um error boundary no React.

#### Express (error-handler.ts)

```ts
export const errorHandler: ErrorRequestHandler =
  (err, _req, res, _next) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }
    if (err instanceof NotFoundError) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Erro interno' });
  };

// app.ts: registrar por último
app.use(errorHandler);
```

Um Middleware especial com 4 parâmetros. Sem o 4º, o Express não reconhece.

#### Spring Boot (GlobalExceptionHandler.java)

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ProductNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public Map<String, Object> notFound(ProductNotFoundException e) {
    return Map.of("status", 404, "message", e.getMessage());
  }
  // outro @ExceptionHandler para erros de validação (400)
}
```

Uma classe com um método por tipo de erro.

#### NestJS ((já vem pronto))

```ts
// Nada a fazer para o básico:
// NotFoundException      -> 404
// ValidationPipe falhou  -> 400
// erro inesperado        -> 500

// Para personalizar o formato: crie um ExceptionFilter
```

**O mais pronto dos quatro.**

#### FastAPI (app/main.py)

```python
@app.exception_handler(ProductNotFound)
async def not_found(request, exc):
    return JSONResponse(status_code=404,
                        content={"message": str(exc)})

# Erros de validação já são tratados sozinhos,
# mas o FastAPI responde 422 (e não 400).
```

Atenção: validação no FastAPI devolve **422** por padrão.

### Passo 13: Liberar o frontend (CORS)

**O que é:** autorizar o endereço do seu frontend (ex.: `localhost:5173`) a chamar a API.

**Por que importa:** sem isso aparece aquele erro de CORS no console do navegador, mesmo com a API funcionando.

#### Express (app.ts)

```ts
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
}));
```

Um pacote extra, uma linha.

#### Spring Boot (CorsConfig.java)

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
      .allowedOrigins("http://localhost:5173")
      .allowedMethods("GET", "POST", "PUT", "DELETE");
  }
}
```

Uma classe de configuração.

#### NestJS (main.ts)

```ts
const app = await NestFactory.create(AppModule);
app.enableCors({ origin: ['http://localhost:5173'] });
await app.listen(8080);
```

Uma linha, já embutida no Nest.

#### FastAPI (app/main.py)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Um middleware que já vem no FastAPI.

### Passo 14: Rodar a API

**O que é:** o comando para ligar a API em modo de desenvolvimento, que reinicia sozinha quando você salva um arquivo.

**Por que importa:** equivale ao `npm run dev` do frontend.

#### Express (terminal)

```bash
npm run dev
# script: tsx watch --env-file=.env src/server.ts
```

API em http://localhost:8080

#### Spring Boot (terminal)

```bash
./mvnw spring-boot:run
```

A primeira vez demora porque o Maven baixa as dependências.

#### NestJS (terminal)

```bash
npm run start:dev
```

Já vem configurado pelo gerador.

#### FastAPI (terminal)

```bash
fastapi dev app/main.py
```

**Bônus:** abra http://localhost:8000/docs para ver e testar a API numa página pronta.

### Passo 15: Testar o CRUD na mão

**O que é:** chamar cada operação do CRUD pelo terminal com `curl`, na ordem: criar, listar, buscar, atualizar e apagar.

**Por que importa:** os comandos são iguais para os quatro; só muda a porta. Também vale testar um erro (preço negativo deve dar 400, ou 422 no FastAPI).

#### Express (terminal (porta 8080))

```bash
B=http://localhost:8080/products

# C: criar
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Teclado","price":299.90,"stock":15}'

# R: listar
curl "$B?page=0&size=10"

# R: buscar
curl $B/1

# U: atualizar
curl -X PUT $B/1 -H "Content-Type: application/json" \
  -d '{"name":"Teclado RGB","price":349.90,"stock":10}'

# D: apagar
curl -i -X DELETE $B/1

# erro: preço negativo
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":-5,"stock":1}'
```

Ver os dados no banco: `docker exec -it products-db psql -U products productsdb -c "SELECT * FROM products;"`

#### Spring Boot (terminal (porta 8080))

```bash
B=http://localhost:8080/products

# C: criar
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Teclado","price":299.90,"stock":15}'

# R: listar
curl "$B?page=0&size=10"

# R: buscar
curl $B/1

# U: atualizar
curl -X PUT $B/1 -H "Content-Type: application/json" \
  -d '{"name":"Teclado RGB","price":349.90,"stock":10}'

# D: apagar
curl -i -X DELETE $B/1

# erro: preço negativo
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":-5,"stock":1}'
```

Mesmos comandos. O formato da listagem vem do `Page` do Spring (com alguns campos a mais).

#### NestJS (terminal (porta 8080))

```bash
B=http://localhost:8080/products

# C: criar
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Teclado","price":299.90,"stock":15}'

# R: listar
curl "$B?page=0&size=10"

# R: buscar
curl $B/1

# U: atualizar
curl -X PUT $B/1 -H "Content-Type: application/json" \
  -d '{"name":"Teclado RGB","price":349.90,"stock":10}'

# D: apagar
curl -i -X DELETE $B/1

# erro: preço negativo
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":-5,"stock":1}'
```

Mesmos comandos, já que o `main.ts` usa `app.listen(8080)`.

#### FastAPI (terminal (porta 8000))

```bash
B=http://localhost:8000/products

# C: criar
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Teclado","price":299.90,"stock":15}'

# R: listar
curl "$B?page=0&size=10"

# R: buscar
curl $B/1

# U: atualizar
curl -X PUT $B/1 -H "Content-Type: application/json" \
  -d '{"name":"Teclado RGB","price":349.90,"stock":10}'

# D: apagar
curl -i -X DELETE $B/1

# erro: preço negativo
curl -i -X POST $B -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":-5,"stock":1}'
```

Ou abra `http://localhost:8000/docs` e teste cada operação clicando.

### Passo 16: Testar automaticamente

**O que é:** um teste que chama a API e confere a resposta. Exemplo: pedir um produto que não existe deve dar 404.

**Por que importa:** nos exemplos o service é um Mock, então o teste roda sem banco, como quando você mocka uma chamada de API no Vitest.

#### Express (product.routes.test.ts)

```ts
vi.mock('./product.service.js');

it('retorna 404 quando não existe', async () => {
  vi.mocked(service.get)
    .mockRejectedValue(new NotFoundError('...'));

  const res = await request(app).get('/products/99');
  expect(res.status).toBe(404);
});
```

**Vitest + Supertest.** Bem familiar para quem vem do frontend.

#### Spring Boot (ProductControllerTest.java)

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
  @Autowired MockMvc mockMvc;
  @MockitoBean ProductService service;

  @Test
  void retorna404() throws Exception {
    when(service.get(99L))
      .thenThrow(new ProductNotFoundException(99L));
    mockMvc.perform(get("/products/99"))
      .andExpect(status().isNotFound());
  }
}
```

**JUnit + Mockito + MockMvc.**

#### NestJS (products.e2e-spec.ts)

```ts
it('retorna 404 quando não existe', () => {
  return request(app.getHttpServer())
    .get('/products/99')
    .expect(404);
});
```

**Jest + Supertest**, já configurados pelo gerador.

#### FastAPI (tests/test_products.py)

```python
client = TestClient(app)

def test_retorna_404():
    r = client.get("/products/99")
    assert r.status_code == 404
```

**pytest + TestClient.** Aqui precisaria de banco ou de sobrescrever `get_db`.

## Tabela comparativa (mapa mental)

| Conceito | O que significa | Frontend | Java / Spring Boot | Express | NestJS | FastAPI |
|---|---|---|---|---|---|---|
| Ponto de entrada | O arquivo que liga tudo quando o programa começa. | main.tsx / index.js | ProductsApplication | server.ts + app.ts | main.ts | app/main.py |
| Rotas / endpoints | Os endereços que o frontend chama. | As URLs que o fetch chama | @RestController | Router + funções controller | @Controller('products') | APIRouter + @router.get(...) |
| Regras de negócio | Onde ficam as decisões ("se não existe, é erro"). | Hooks / services | @Service | funções em product.service.ts | @Injectable() Service | funções em service.py |
| Acesso ao banco | A parte que busca e salva dados. | Arquivo de chamadas de API (api/products.ts) | Repository (JpaRepository, gerado) | product.repository.ts (SQL escrito por você, via pg) | Repository<Product> (TypeORM) | Session do SQLAlchemy (sem arquivo de repository) |
| Tabela / modelo de dados | Como a tabela do banco aparece no código. | type Product = {...} | @Entity (JPA/Hibernate) | sem ORM: tabela em init.sql + interface TS | @Entity (TypeORM) | model SQLAlchemy (Mapped[...]) |
| DTO | O formato dos dados que entram e saem da API. | Types de request/response | record | schema Zod + tipo inferido | classe com decorators | modelo Pydantic |
| Validação | Checar se os dados recebidos são válidos. | Zod / Yup no formulário | Bean Validation (@NotBlank, @Positive) | Zod | class-validator + ValidationPipe | Pydantic (automática pelos type hints) |
| Injeção de dependência | O framework entrega pronto aquilo que a classe precisa. | Props / Context | Construtor (o Spring injeta) | Não existe (imports diretos) | Construtor + Modules | Depends() |
| Erros globais | Um lugar só que transforma erros em respostas. | try/catch / error boundary | @RestControllerAdvice | Middleware de erro (4 parâmetros) | NotFoundException pronta + filtros | @app.exception_handler |
| CORS | Permitir que o frontend chame a API. | Erro que aparece no navegador | WebMvcConfigurer | pacote cors | app.enableCors() | CORSMiddleware |
| Configuração | Onde ficam endereço do banco, senhas e portas. | .env | application.properties | .env (--env-file) | AppModule (TypeOrmModule.forRoot) | variável DATABASE_URL (os.getenv) |
| Dependências | A lista de bibliotecas do projeto e quem instala. | package.json + npm | pom.xml + Maven (./mvnw) | package.json + npm | package.json + npm | requirements.txt + pip + venv |
| Gerador de projeto | Ferramenta que cria a estrutura inicial. | npm create vite | start.spring.io | nenhum (npm init manual) | Nest CLI | nenhum (venv + pip install) |
| Rodar em dev | Comando para ligar enquanto programa. | npm run dev | ./mvnw spring-boot:run | npm run dev (tsx watch) | npm run start:dev | fastapi dev app/main.py |
| Testes | Ferramentas para testar automaticamente. | Vitest / Jest | JUnit + Mockito + MockMvc | Vitest + Supertest | Jest + Supertest | pytest + TestClient |
| Documentação da API | Página que lista e deixa testar os endpoints. | Swagger/OpenAPI (consumido) | springdoc (extra) | não incluída | @nestjs/swagger (extra) | automática em /docs |

## Glossário

**API**: Um programa que fica rodando num servidor esperando pedidos. O frontend pede ("me dá o produto 1") e a API responde com dados, geralmente em JSON.

**CRUD**: Sigla para as quatro operações básicas: Create (criar), Read (ler), Update (atualizar) e Delete (apagar).

**Endpoint (rota)**: Um endereço da API, formado por método + caminho. Ex.: GET /products/1. É a URL que o seu fetch chama.

**Framework**: Um conjunto de ferramentas prontas que dá a estrutura do projeto. Express, Spring Boot, NestJS e FastAPI são frameworks para criar APIs.

**Requisição e resposta**: Requisição é o pedido que chega na API (método, URL, corpo). Resposta é o que a API devolve (status e dados).

**Status HTTP**: Número que diz como foi a resposta. 200 deu certo, 201 criado, 204 deu certo sem conteúdo, 400 dados errados, 404 não encontrado, 500 erro no servidor.

**JSON**: O formato de texto usado para enviar dados entre frontend e API. É o mesmo formato de objeto que você já usa em JavaScript.

**SQL**: A linguagem usada para falar com o banco de dados. Ex.: SELECT * FROM products WHERE id = 1.

**ORM**: Uma biblioteca que escreve o SQL por você. Você mexe com classes e objetos e ela traduz para comandos do banco. Exemplos: JPA/Hibernate (Java), TypeORM (Nest), SQLAlchemy (Python).

**Entidade (model)**: A representação de uma tabela do banco no código. A classe Product com id, name, price vira a tabela products.

**DTO (Data Transfer Object)**: O formato dos dados que entram ou saem da API. Ex.: para criar um produto, o frontend manda só name, description, price e stock; o id e a data quem gera é o banco. Esse "molde" de entrada é o DTO. É como os types de request e response que você cria no frontend.

**Validação**: Checar se os dados recebidos fazem sentido antes de salvar. Ex.: preço precisa ser maior que zero. Se não passar, a API responde 400.

**Controller**: A parte do código que recebe a requisição, chama quem faz o trabalho e devolve a resposta. É a "porta de entrada" de cada rota.

**Service**: A parte com as regras de negócio. Ex.: "se o produto não existe, isso é um erro". Não sabe nada de HTTP nem de SQL.

**Repository**: A única parte que conversa com o banco de dados. Busca, salva, atualiza e apaga.

**Injeção de dependência**: Em vez de uma classe criar o que precisa (new ProductService()), o framework cria e entrega pronto no construtor. Parecido com receber algo por props ou Context no React.

**Decorator / anotação**: Aquelas marcações com @ em cima de classes e métodos, como @Controller ou @GetMapping. Elas dizem ao framework o que aquela classe ou método é.

**Middleware**: Uma função que roda no meio do caminho, antes de a requisição chegar na rota (ou depois de dar erro). Ex.: transformar o texto do corpo em objeto.

**CORS**: Regra de segurança do navegador. Se o frontend está em localhost:5173 e a API em localhost:8080, a API precisa dizer explicitamente que aceita pedidos dessa origem.

**Variável de ambiente**: Configuração que fica fora do código, num arquivo .env ou no servidor. Ex.: o endereço do banco. Assim você não escreve senha no código.

**Pool de conexões**: Um grupo de conexões com o banco abertas e reaproveitadas. Abrir uma conexão nova a cada pedido seria lento.

**Docker**: Ferramenta que roda programas (como o PostgreSQL) em "caixinhas" isoladas, sem precisar instalar direto no seu computador.

**Mock**: Uma versão falsa de uma parte do código usada em testes. Ex.: fingir que o service respondeu "não encontrado" sem precisar de banco.

**venv (Python)**: Uma pasta isolada com as bibliotecas do projeto Python. Faz o papel que a node_modules faz no Node.

## Observação

A coluna Express segue o guia original. As versões em Spring Boot, NestJS e FastAPI são equivalentes escritas seguindo o mesmo mapa mental, com as cinco operações do CRUD completas.
