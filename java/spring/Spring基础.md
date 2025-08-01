# Spring 基础

## Ioc容器

IOC（控制反转）是Spring框架的核心概念，它是一种设计原则，通过Spring IoC容器来管理对象的创建和依赖关系 。

Spring IoC容器主要通过**ApplicationContext**接口实现，它负责实例化、配置和组装beans。容器通过读取配置元数据来获取关于要实例化、配置和组装的组件的指令。

### Bean

Bean本质上就是一个普通的Java对象，但它的特殊之处在于由Spring IoC容器负责实例化、组装和管理。在容器内部，这些bean定义被表示为**BeanDefinition**对象。

**BeanDefinition**是Spring框架中描述bean实例的核心接口，它包含了创建和配置bean所需的所有元数据信息。**FactoryBean** 当Spring容器解析配置并遇到FactoryBean定义时，容器会调用FactoryBean的getObject()方法，以此来获取真正需要的Bean实例。通过FactoryBean可以实现自定义实例化逻辑，延迟初始化、集成第三方包等功能。

## AOP

如果只需要对Spring beans的方法执行进行增强，Spring AOP是正确的选择。如果需要增强不由Spring容器管理的对象（如领域对象），则需要使用AspectJ。

SpringAop的实现：

- 动态代理（InvocationHandler）：JDK原生的实现方式，需要被代理的目标类必须实现接口。因为这个技术要求**代理对象和目标对象实现同样的接口**。
- cglib：通过**继承被代理的目标类**实现代理，所以不需要目标类实现接口。

## 事务

数据库事务( transaction)是访问并可能操作各种数据项的一个数据库操作序列，这些操作要么全部执行,要么全部不执行，是一个不可分割的工作单位。事务由事务开始与事务结束之间执行的全部数据库操作组成。

Spring事务管理的两种方式

- 声明式事务管理 @Transactional
- 编程式事务管理 TransactionTemplate TransactionalOperator TransactionManager

## 资源操作：Resources

Spring的Resource声明了访问low-level资源的能力。

**Resource**接口是整个资源系统的核心，它抽象了底层资源类型，提供统一的API来访问内容。一般包括这些实现类：UrlResource、ClassPathResource、FileSystemResource。。。

Spring 提供如下两个标志性接口：

- **ResourceLoader ：** 该接口实现类的实例可以获得一个Resource实例。
- **ResourceLoaderAware ：** 该接口实现类的实例将获得一个ResourceLoader的引用。如果把实现ResourceLoaderAware接口的Bean类部署在Spring容器中，Spring容器会将自身（是指对应的ApplicationContext）当成ResourceLoader作为setResourceLoader()方法的参数传入。

ApplicationContext实现类都实现ResourceLoader接口，因此ApplicationContext可直接获取Resource实例。

使用ApplicationContext访问资源时，可通过不同前缀指定强制使用指定的ClassPathResource、FileSystemResource等实现类

```java
Resource res = ctx.getResource("calsspath:bean.xml");
Resrouce res = ctx.getResource("file:bean.xml");
Resource res = ctx.getResource("http://localhost:8080/beans.xml");
```

Resource依赖注入

```java
@Component
public class ResourceBean {
    
    @Value("classpath:atguigu.txt")
    private Resource resource;
    
}
```

## 国际化 i18n

### JDK国际化

java.util.Locale用于指定当前用户所属的语言环境等信息，Locale包含了language信息和country信息。

java.util.ResourceBundle用于查找绑定对应的资源文件。

配置文件一般放在resources目录下。命名规则：**basename_language_country.properties** ，举例：messages_en_CN.propertes。

```java
ResourceBundle bundle = ResourceBundle.getBundle("messages",
                new Locale("zh", "CN"));
String value = bundle1.getString("test");
System.out.println(value);
```

### Spring国际化

spring中国际化是通过`MessageSource`这个接口来支持的。

```properties
cus_message=欢迎 {0}my_testcus,时间:{1}
ApplicationContext context = ...;
Object[] objs = new Object[]{"atguigu",new Date().toString()};
String value = context.getMessage("cus_message", objs, Locale.CHINA);
System.out.println(value);
```

## 数据校验 Validation

### 通过Validator接口实现

```java
public class PersonValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return Person.class.equals(clazz);
    }

    //校验规则
    @Override
    public void validate(Object target, Errors errors) {
        //name不能为空
        ValidationUtils.rejectIfEmpty(errors,
                "name", "name.empty","name is null");

        //age 不能小于0，不能大于200
        Person p = (Person)target;
        if(p.getAge() < 0) {
            errors.rejectValue("age","age.value.error","age < 0");
        } else if(p.getAge() > 200) {
            errors.rejectValue("age","age.value.error.old","age > 200");
        }
    }
}
//创建person对应databinder
DataBinder binder = new DataBinder(person);

//设置校验器
binder.setValidator(new PersonValidator());

//调用方法执行校验
binder.validate();

//输出校验结果
BindingResult result = binder.getBindingResult();
System.out.println(result.getAllErrors());
```

### 使用LocalValidatorFactoryBean

Spring的校验框架包是`org.springframework.validation`，其中LocalValidatorFactoryBean同时实现了Spring的Validator和JSR-303的Validator接口，但是Spring本身没有提供JSR-303的实现，因此必须将实现了JSR-303的jar放在类路径下。

使用LocalValidatorFactoryBean来校验数据示例：

```java
@Bean
public LocalValidatorFactoryBean validator() {
    return new LocalValidatorFactoryBean();
}
@Getter
@Setter
public class User {
    @NotNull
    private String name;

    @Min(0)
    @Max(150)
    private int age;
}
// import jakarta.validation.Validator;
@Autowired
private Validator validator;

public boolean validatorByUserOne(User user) {
    Set<ConstraintViolation<User>> validate = validator.validate(user);
    return validate.isEmpty();
}
// import org.springframework.validation.Validator;
@Autowired
private Validator validator;

public boolean validatorByUserTwo(User user) {
    BindException bindException = new BindException(user,user.getName());
    validator.validate(user,bindException);
    List<ObjectError> allErrors = bindException.getAllErrors();
    System.out.println(allErrors);
    return bindException.hasErrors();
}
```

### 使用**MethodValidationPostProcessor**

`MethodValidationPostProcessor`是Spring提供的来实现基于方法`Method`的`JSR`校验的核心处理器~它能让约束作用在方法入参、返回值上。

示例：`public @NotNull Object myValidMethod(@NotNull String arg1, @Max(10) int arg2)`

官方说明：方法里写有JSR校验注解要想其生效的话，**要求类型级别上必须使用**`**@Validated**`**标注**

完整示例：

```java
@Bean
public MethodValidationPostProcessor validationPostProcessor() {
    return new MethodValidationPostProcessor();
}
@Getter
@Setter
public class User {
    @NotNull
    private String name;
    
    @Min(0)
    @Max(150)
    private int age;
    
    @Pattern(regexp = "^1(3|4|5|7|8)\\d{9}$",message = "手机号码格式错误")
    @NotBlank(message = "手机号码不能为空")
    private String phone;
    
}
@Service
@Validated    // 注意，由于方法里使用了@NotNull,此处需要添加 @Validated
public class MyService {

    public String testMethod(@NotNull @Valid User user) {
        return user.toString();
    }
}
```

### 自定义校验注解

```java
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
// 指定实际处理校验逻辑的实现类
@Constraint(validatedBy = {CannotBlankValidation.class})
public @interface CannotBlank {

    //默认错误信息
    String message() default "不能包含空格";  // 必须

    Class<?>[] groups() default {};   // 必须

    Class<? extends Payload>[] payload() default {};  // 必须

}
public class CannotBlankValidation implements ConstraintValidator<CannotBlank,String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value != null && value.contains(" ")) {
            //获取默认提示信息
            String defaultConstraintMessageTemplate = context.getDefaultConstraintMessageTemplate();
            System.out.println("default message :" + defaultConstraintMessageTemplate);
            //禁用默认提示信息
            context.disableDefaultConstraintViolation();
            //设置提示语
            context.buildConstraintViolationWithTemplate("can not contains blank").addConstraintViolation();
            return false;
        }
        return false;
    }
}
ApplicationContext context =
                new AnnotationConfigApplicationContext(ValidationConfig.class);
MyService service = context.getBean(MyService.class);
User user = new User();
user.setName("lucy");
user.setPhone("13566754321");
// User的字段message已经被标记为@CannotBlank
user.setMessage("test a t guigu");
// service参考上一节的MyService
service.testMethod(user);
```