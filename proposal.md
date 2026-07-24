###### 사양
1. 서버: nestjs, better-sqlite3
2. 클라이언트: overland 어플리케이션

###### 동작
1. 클라이언트에 overland 어플리케이션을 설치하고, 서버의 url을 설정한다.
2. 서버는 overland 에서 온 http request 의 json body를 serialized 된 상태 그대로 createdat과 함께 sqlite에 insert한다.

###### 스코핑
위의 정의 이상으로 기능이 불필요하므로 그 이상의 개발을 금지한다.

###### 개발론
향후 코드의 유지보수성을 위해 코드를 최대한 간결하게 작성하고, 불필요한 변수 및 함수를 과하게 나누어 작성하지 않는다.