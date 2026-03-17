# ENGSE207 Software Architecture  
## README — Final Lab Set 1: Microservices + HTTPS + Lightweight Logging

> เอกสารฉบับนี้ใช้เป็น `README.md` สำหรับ repository ของ **Final Lab Set 1**  
> นักศึกษาสามารถปรับแก้รายละเอียด เช่น ชื่อสมาชิก, ภาพ architecture, URL หรือคำอธิบายเพิ่มเติม ให้สอดคล้องกับงานจริงของกลุ่ม

---

## 1. ข้อมูลรายวิชาและสมาชิก

**รายวิชา:** ENGSE207 Software Architecture  
**ชื่องาน:** Final Lab — ชุดที่ 1: Microservices + HTTPS + Lightweight Logging  

**สมาชิกในกลุ่ม**
- ชื่อ-สกุล / รหัสนักศึกษา: นายภูริณัฐ เต๋จ๊ะ / 67543210022-9

**Repository:** `Final-lab-set1/`

---

## 2. ภาพรวมของระบบ

Final Lab ชุดที่ 1 เป็นการพัฒนาระบบ Task Board แบบ Microservices โดยเน้นหัวข้อสำคัญดังนี้

- การทำงานแบบแยก service
- การใช้ Nginx เป็น API Gateway
- การเปิดใช้งาน HTTPS ด้วย Self-Signed Certificate
- การยืนยันตัวตนด้วย JWT
- การจัดเก็บ log แบบ Lightweight Logging ผ่าน Log Service
- การเชื่อมต่อ Frontend กับ Backend ผ่าน HTTPS

งานชุดนี้ **ไม่มี Register** และใช้เฉพาะ **Seed Users** ที่กำหนดไว้ในฐานข้อมูล

---

## 3. วัตถุประสงค์ของงาน

งานนี้มีจุดมุ่งหมายเพื่อฝึกให้นักศึกษาสามารถ

- ออกแบบระบบแบบ Microservices ในระดับพื้นฐาน
- ใช้ Nginx เป็น reverse proxy และ TLS termination
- ใช้ JWT สำหรับ authentication ระหว่าง frontend และ backend
- ออกแบบ logging flow ผ่าน REST API และจัดเก็บ log ลงฐานข้อมูล
- ใช้ Docker Compose เพื่อรวมทุก service ให้ทำงานร่วมกันได้

---

## 4. Architecture Overview

> ให้วางภาพ architecture diagram ของกลุ่มไว้ในส่วนนี้  
> เช่น `docs/architecture-set1.png` หรือแทรกรูปจากโฟลเดอร์ `screenshots/`

```text
[ Browser / Postman ]
               │
               │ HTTPS (Port 443)
               ▼
      ┌─────────────────────────┐
      │     Nginx Gateway       │───┐ (Redirect HTTP to HTTPS)
      └────────────┬────────────┘   │
                   │                │
        ┌──────────┴──────────┐     │
        ▼                     ▼     ▼
  ┌───────────┐         ┌───────────┐         ┌───────────┐
  │ Auth Svc  │         │ Task Svc  │         │ Log Svc   │
  │  (:3001)  │         │  (:3002)  │         │  (:3003)  │
  └─────┬─────┘         └─────┬─────┘         └─────┬─────┘
        │                     │                     │
        └──────────┬──────────┴─────────────────────┘
                   ▼
          ┌─────────────────┐
          │   PostgreSQL    │
          │  (Shared DB)    │
          └─────────────────┘
```

### Services ที่ใช้ในระบบ
- **nginx** — API Gateway, HTTPS, rate limiting
- **frontend** — หน้าเว็บ Task Board และ Log Dashboard
- **auth-service** — Login, Verify, Me
- **task-service** — CRUD Tasks
- **log-service** — รับและแสดง logs
- **postgres** — shared database

---

## 5. โครงสร้าง Repository

```text
final-lab-set1/
├── README.md
├── TEAM_SPLIT.md
├── INDIVIDUAL_REPORT_[studentid].md
├── docker-compose.yml
├── .env.example
├── nginx/
├── frontend/
├── auth-service/
├── task-service/
├── log-service/
├── db/
├── scripts/
└── screenshots/
```

---

## 6. เทคโนโลยีที่ใช้

- Node.js / Express.js
- PostgreSQL
- Nginx
- Docker / Docker Compose
- HTML / CSS / JavaScript
- JWT
- bcryptjs

---

## 7. การตั้งค่าและการรันระบบ

### 7.1 สร้าง Self-Signed Certificate

```bash
chmod +x scripts/gen-certs.sh
./scripts/gen-certs.sh
```

### 7.2 สร้างไฟล์ `.env`
คัดลอกจาก `.env.example` แล้วกำหนดค่าตามต้องการ เช่น

```env
POSTGRES_DB=taskboard
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
JWT_SECRET=engse207-super-secret-change-me
JWT_EXPIRES=1h
```

### 7.3 สร้าง bcrypt hash สำหรับ Seed Users
ในงานชุดนี้ กลุ่มของเรากำหนดให้ **สร้าง bcrypt hash เอง** ก่อนรันระบบ

ตัวอย่างคำสั่ง:

```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('alice123',10))"
node -e "const b=require('bcryptjs'); console.log(b.hashSync('bob456',10))"
node -e "const b=require('bcryptjs'); console.log(b.hashSync('adminpass',10))"
```

จากนั้นนำค่าที่ได้ไปแทนในไฟล์ `db/init.sql`

### 7.4 รันระบบ

```bash
docker compose down -v
docker compose up --build
```

### 7.5 เปิดใช้งานผ่าน Browser
- Frontend: `https://localhost`
- Log Dashboard: `https://localhost/logs.html`

> หมายเหตุ: เนื่องจากใช้ self-signed certificate browser อาจขึ้นคำเตือนด้านความปลอดภัย ให้กดยอมรับเพื่อเข้าทดสอบ

---

## 8. Seed Users สำหรับทดสอบ

| Username | Email | Password | Role |
|---|---|---|---|
| alice | alice@lab.local | alice123 | member |
| bob | bob@lab.local | bob456 | member |
| admin | admin@lab.local | adminpass | admin |

> หมายเหตุ: ต้อง generate bcrypt hash จริงแล้วแทนค่าลงใน `db/init.sql` ก่อน login

---

## 9. API Summary

### Auth Service
- `POST /api/auth/login`
- `GET /api/auth/verify`
- `GET /api/auth/me`
- `GET /api/auth/health`

### Task Service
- `GET /api/tasks/health`
- `GET /api/tasks/`
- `POST /api/tasks/`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Log Service
- `POST /api/logs/internal`
- `GET /api/logs/`
- `GET /api/logs/stats`
- `GET /api/logs/health`

---

## 10. การทดสอบระบบ

### ตัวอย่างลำดับการทดสอบ
1. รัน `docker compose up --build`
2. เปิด `https://localhost`
3. Login ด้วย seed users
4. สร้าง task ใหม่
5. ดูรายการ task
6. แก้ไข task
7. ลบ task
8. ทดสอบกรณีไม่มี JWT → ต้องได้ `401`
9. ทดสอบ Log Dashboard
10. ทดสอบ rate limiting ของ login

### ตัวอย่าง curl
```bash
BASE="https://localhost"

TOKEN=$(curl -sk -X POST $BASE/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"alice@lab.local","password":"alice123"}' |   python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

curl -sk $BASE/api/tasks/ -H "Authorization: Bearer $TOKEN"
```

---

## 11. Screenshots

โฟลเดอร์ `screenshots/` ของกลุ่มนี้ประกอบด้วยภาพดังต่อไปนี้

- `01_docker_running.png`
- `02_https_browser.png`
- `03_login_success.png`
- `04_login_fail.png`
- `05_create_task.png`
- `06_get_tasks.png`
- `07_update_task.png`
- `08_delete_task.png`
- `09_no_jwt_401.png`
- `10_logs_api.png`
- `11_rate_limit.png`
- `12_frontend_screenshot.png`

---

## 12. การแบ่งงานของทีม

รายละเอียดการแบ่งงานของสมาชิกอยู่ในไฟล์:

- `TEAM_SPLIT.md`

และรายงานรายบุคคลของสมาชิกแต่ละคนอยู่ในไฟล์:

- `INDIVIDUAL_REPORT_[67543210022-9].md`

---

## 13. ปัญหาที่พบและแนวทางแก้ไข

- SSL Verification Error: Postman ไม่ยอมให้ยิง API เพราะมองว่าใบเซอร์ไม่ปลอดภัย
วิธีแก้ไข: ตั้งค่า SSL certificate verification เป็น OFF ใน Postman Settings

- JWT Secret Mismatch: แต่ละ Service ตรวจสอบสิทธิ์ไม่ผ่าน
วิธีแก้ไข: ตรวจสอบไฟล์ .env และมั่นใจว่าทุก Service เรียกใช้ Secret ตัวเดียวกันผ่าน Docker Environment

- Nginx 429 ไม่ทำงาน: ตั้งค่า Rate Limit โซนเล็กเกินไป
วิธีแก้ไข: ปรับแต่ง limit_req_zone ใน nginx.conf และใช้การยิงรัวผ่าน Loop ใน Terminal เพื่อทดสอบ

---

## 14. ข้อจำกัดของระบบ

- Security: ใช้ Self-signed Certificate ซึ่งเหมาะสำหรับการพัฒนา (Development) เท่านั้น หากใช้งานจริงต้องใช้ใบรับรองจาก CA (เช่น Let's Encrypt)
- Scalability: เนื่องจากใช้ Shared Database หากมีการใช้งานจำนวนมาก อาจเกิดคอขวดที่ฐานข้อมูลก้อนเดียว
- Logging: ระบบ Logging เป็นแบบ Lightweight เหมาะสำหรับ Audit เบื้องต้น ไม่รองรับการวิเคราะห์ข้อมูลขนาดใหญ่ (Big Data)


---

## 15. การต่อยอดไปยัง Set 2

ใน Set 2 จะพัฒนาระบบให้ซับซ้อนขึ้นโดย:

- Infrastructure Shift (Local to Cloud):
ต่อยอดจากการเรียนรู้เรื่อง TLS Termination ใน Nginx สู่การใช้งาน Cloud-native HTTPS บน Railway โดยจะเปลี่ยนจากระบบใบรับรองแบบ Self-signed ไปเป็นระบบอัตโนมัติ เพื่อให้ระบบสามารถเข้าถึงได้จาก Public Internet อย่างปลอดภัย 100%
- Database Evolution (Shared to Decoupled):
เปลี่ยนสถาปัตยกรรมจาก Shared Database (ก้อนเดียว) ไปเป็นแบบ Database-per-Service (แยก 3 ก้อนสำหรับ Auth, Task และ User) เพื่อลดแรงยึดเหนี่ยวระหว่าง Service (Tight Coupling) และเพิ่มความสามารถในการ Scaling ตามทฤษฎี Microservices Architecture
- Expansion of Services:
เพิ่ม User Service และ Register API เพื่อรองรับวงจรชีวิตของผู้ใช้ที่สมบูรณ์ขึ้น (User Lifecycle Management) โดยจะนำข้อมูลจาก JWT Payload ที่ออกแบบไว้ใน Set 1 มาเป็นกุญแจสำคัญ (Logical Reference) ในการเชื่อมโยงข้อมูลข้ามฐานข้อมูลที่แยกจากกัน
- Security Hardening on Cloud:
นำประสบการณ์การตั้งค่า Rate Limiting และ Gateway Security จาก Nginx ใน Set 1 มาประยุกต์ใช้ในการเลือก Gateway Strategy บนระบบ Cloud เพื่อคัดกรองสิทธิ์การเข้าถึงผ่าน Bearer Token อย่างเข้มงวดในทุก Endpoint
- Data Consistency Strategy:
ใน Set 2 จะเปลี่ยนจากการใช้ Physical Foreign Keys ไปเป็นการจัดการความสัมพันธ์ของข้อมูลแบบ Logical Relationship โดยอาศัย user_id จาก Auth Service เป็นตัวกลาง เพื่อรองรับสถาปัตยกรรมฐานข้อมูลแบบแยกส่วนอย่างแท้จริง

---

## 16. ภาคผนวก

### ไฟล์สำคัญใน repository
- `docker-compose.yml`
- `nginx/nginx.conf`
- `db/init.sql`
- `auth-service/src/routes/auth.js`
- `task-service/src/routes/tasks.js`
- `log-service/src/index.js`
- `frontend/index.html`
- `frontend/logs.html`

---

> เอกสารฉบับนี้เป็น README สำหรับงาน Final Lab Set 1 ของกลุ่ม และจัดทำเพื่อประกอบการส่งงานในรายวิชา ENGSE207 Software Architecture