# 🏠 Konfiguracja lokalnego serwera Speckle

## ✅ Status połączenia

Twój lokalny serwer Speckle działa poprawnie! Oto szczegóły:

### 🔗 Informacje o serwerze
- **URL**: http://127.0.0.1:3002
- **GraphQL Endpoint**: http://127.0.0.1:3002/graphql
- **Token**: `fa7b133e8fcdbfb0bbd85a6c3acb2de8052951d58c`
- **Użytkownik**: ggbet

### 📊 Dostępne strumienie
1. **SKP_KRAKOW** (ID: 7d56528c16)
2. **plugin** (ID: 3d2b6dfd5e)  
3. **Test** (ID: ba625c1787)

## 🔧 Konfiguracja aplikacji

### 1. Utwórz plik `.env.local`
```bash
# Skopiuj do FabManageNew/.env.local
VITE_SPECKLE_SERVER=http://127.0.0.1:3002
VITE_SPECKLE_TOKEN=fa7b133e8fcdbfb0bbd85a6c3acb2de8052951d58c
```

### 2. Restart aplikacji
```bash
npm run dev
```

## 🧪 Testy połączenia

### Test GraphQL
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer fa7b133e8fcdbfb0bbd85a6c3acb2de8052951d58c" \
  -d '{"query": "query { user { name } }"}' \
  http://127.0.0.1:3002/graphql
```

### Test strumieni
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer fa7b133e8fcdbfb0bbd85a6c3acb2de8052951d58c" \
  -d '{"query": "query { user { streams { items { id name description } } } }"}' \
  http://127.0.0.1:3002/graphql
```

### Test commitów
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer fa7b133e8fcdbfb0bbd85a6c3acb2de8052951d58c" \
  -d '{"query": "query { stream(id: \"7d56528c16\") { commits { items { id message createdAt authorName } } } }"}' \
  http://127.0.0.1:3002/graphql
```

## 🎯 Przykładowe URL-e modeli

### Strumień SKP_KRAKOW
```
http://127.0.0.1:3002/streams/7d56528c16/commits/96630d41dd
```

### Strumień Test
```
http://127.0.0.1:3002/streams/ba625c1787
```

## 🚀 Jak używać w FabManage

1. **Otwórz projekt** w FabManage
2. **Przejdź do zakładki "Model 3D"**
3. **Wklej URL strumienia** (np. `http://127.0.0.1:3002/streams/7d56528c16/commits/96630d41dd`)
4. **Kliknij "Zapisz link"**
5. **Model 3D załaduje się automatycznie**

## 🔍 Rozwiązywanie problemów

### Problem: Model się nie ładuje
- ✅ Sprawdź czy serwer Speckle działa na porcie 3002
- ✅ Sprawdź czy token jest poprawny
- ✅ Sprawdź czy URL strumienia jest kompletny

### Problem: Błąd "Unauthorized"
- ✅ Sprawdź czy token nie wygasł
- ✅ Sprawdź czy token ma odpowiednie uprawnienia

### Problem: Brak strumieni
- ✅ Sprawdź czy masz dostęp do strumieni
- ✅ Sprawdź czy strumienie nie są prywatne

## 📝 Notatki

- **Port 8081**: Frontend Speckle (interfejs webowy)
- **Port 3002**: GraphQL API (używany przez aplikację)
- **Token**: Ważny do momentu wygaśnięcia lub odwołania

---

**🎉 Twój lokalny serwer Speckle jest gotowy do użycia z FabManage!**


